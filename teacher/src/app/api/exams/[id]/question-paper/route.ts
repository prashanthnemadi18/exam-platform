import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: { finalY: number };
  }
}

/**
 * Decode HTML entities to plain text and normalize for PDF
 * Handles multiple levels of encoding and preserves Unicode characters
 */
function decodeHTMLEntities(text: string): string {
  if (!text) return '';
  
  let decoded = text;
  let previousDecoded = '';
  let iterations = 0;
  const maxIterations = 5;
  
  while (decoded !== previousDecoded && iterations < maxIterations) {
    previousDecoded = decoded;
    
    decoded = decoded
      .replace(/&#(\d+);/g, (_match, dec) => String.fromCharCode(dec))
      .replace(/&#x([0-9a-f]+);/gi, (_match, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .replace(/&mdash;/g, '—')
      .replace(/&ndash;/g, '–')
      .replace(/&hellip;/g, '...')
      .replace(/&ldquo;/g, '"')
      .replace(/&rdquo;/g, '"')
      .replace(/&lsquo;/g, "'")
      .replace(/&rsquo;/g, "'")
      .replace(/&amp;/g, '&');
    
    iterations++;
  }
  
  decoded = decoded
    .replace(/\u200B/g, '')
    .replace(/\uFEFF/g, '')
    .trim();
  
  return decoded;
}

/**
 * Check if text contains non-Latin characters (Indian languages, etc.)
 */
function hasNonLatinCharacters(text: string): boolean {
  // Check for Indian scripts and other non-Latin Unicode ranges
  return /[\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/.test(text);
}

/**
 * Add text with fallback for non-Latin characters
 * Uses standard encoding to preserve Unicode
 */
function addTextWithEncoding(doc: jsPDF, text: string, x: number, y: number, options?: any): void {
  try {
    if (options) {
      doc.text(text, x, y, options);
    } else {
      doc.text(text, x, y);
    }
  } catch (error) {
    console.error('Error adding text to PDF:', error);
    // Fallback: try without special characters
    const fallbackText = text.replace(/[^\x00-\x7F]/g, '?');
    if (options) {
      doc.text(fallbackText, x, y, options);
    } else {
      doc.text(fallbackText, x, y);
    }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: examId } = await params;
    const exams = await db.exams.getAll();
    const exam = exams.find((e: any) => e.id === examId);

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // Check if exam contains non-Latin characters
    const hasNonLatin = exam.questions.some((q: any) => 
      hasNonLatinCharacters(q.questionText) || 
      (q.options && q.options.some((opt: string) => hasNonLatinCharacters(opt))) ||
      hasNonLatinCharacters(q.correctAnswer) ||
      hasNonLatinCharacters(q.explanation || '')
    );

    // Create PDF with standard encoding
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    doc.setFont('helvetica', 'normal');
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;

    // Header with gradient effect
    doc.setFillColor(147, 51, 234); // Purple
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    addTextWithEncoding(doc, 'QUESTION PAPER', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    addTextWithEncoding(doc, `Max Marks: ${exam.questions.length}`, pageWidth / 2, 30, { align: 'center' });

    // Add warning if non-Latin characters detected
    if (hasNonLatin) {
      doc.setFillColor(255, 243, 205);
      doc.setDrawColor(255, 193, 7);
      doc.roundedRect(margin, 35, contentWidth, 8, 1, 1, 'FD');
      doc.setFontSize(8);
      doc.setTextColor(120, 53, 15);
      doc.setFont('helvetica', 'bold');
      addTextWithEncoding(doc, '⚠ Note: This PDF may not display Indian language characters correctly. Please view the exam online for proper formatting.', pageWidth / 2, 40, { align: 'center' });
      doc.setTextColor(0, 0, 0);
    }

    // Exam details box
    doc.setFillColor(249, 250, 251);
    doc.setDrawColor(229, 231, 235);
    const detailsY = hasNonLatin ? 50 : 45;
    doc.roundedRect(margin, detailsY, contentWidth, 35, 2, 2, 'FD');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    
    // Exam info
    const infoY = detailsY + 7;
    const lineHeight = 6;
    
    doc.text('Exam Title:', margin + 5, infoY);
    doc.setFont('helvetica', 'normal');
    addTextWithEncoding(doc, exam.title, margin + 35, infoY);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Subject:', margin + 5, infoY + lineHeight);
    doc.setFont('helvetica', 'normal');
    addTextWithEncoding(doc, exam.subject, margin + 35, infoY + lineHeight);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Topic:', margin + 5, infoY + lineHeight * 2);
    doc.setFont('helvetica', 'normal');
    addTextWithEncoding(doc, exam.topic || 'General', margin + 35, infoY + lineHeight * 2);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Difficulty:', margin + 5, infoY + lineHeight * 3);
    doc.setFont('helvetica', 'normal');
    addTextWithEncoding(doc, exam.difficulty, margin + 35, infoY + lineHeight * 3);
    
    // Right side info
    doc.setFont('helvetica', 'bold');
    doc.text('Duration:', pageWidth / 2 + 10, infoY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${exam.duration} minutes`, pageWidth / 2 + 35, infoY);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Questions:', pageWidth / 2 + 10, infoY + lineHeight);
    doc.setFont('helvetica', 'normal');
    doc.text(`${exam.questions.length}`, pageWidth / 2 + 35, infoY + lineHeight);

    // Instructions box
    const instructY = hasNonLatin ? 90 : 85;
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(251, 191, 36);
    doc.roundedRect(margin, instructY, contentWidth, 20, 2, 2, 'FD');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(146, 64, 14);
    doc.text('Instructions:', margin + 5, instructY + 7);
    doc.setFont('helvetica', 'normal');
    doc.text('Answer all questions carefully', margin + 5, instructY + 12);
    doc.text('Each question carries 1 mark', margin + 5, instructY + 16);

    // Questions section
    let yPosition = hasNonLatin ? 120 : 115;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(147, 51, 234);
    doc.text('QUESTIONS', margin, yPosition);
    yPosition += 10;

    // Render questions
    exam.questions.forEach((question: any, index: number) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }

      // Question number box
      doc.setFillColor(147, 51, 234);
      doc.circle(margin + 4, yPosition - 2, 4, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}`, margin + 4, yPosition + 1, { align: 'center' });

      // Question text with HTML entity decoding
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      
      const decodedQuestionText = decodeHTMLEntities(question.questionText);
      const questionTextStr = `Q${index + 1}: ${String(decodedQuestionText)}`;
      const questionLines = doc.splitTextToSize(questionTextStr, contentWidth - 15);
      
      addTextWithEncoding(doc, questionLines, margin + 10, yPosition);
      yPosition += questionLines.length * 6;

      // Options
      if (question.options && question.options.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        
        question.options.forEach((option: string, optIndex: number) => {
          if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = 20;
          }

          const decodedOption = decodeHTMLEntities(option);
          const decodedCorrectAnswer = decodeHTMLEntities(question.correctAnswer);
          const optionStr = String(decodedOption);
          const correctStr = String(decodedCorrectAnswer);
          const optionLabel = String.fromCharCode(65 + optIndex); // A, B, C, D
          const isCorrect = optionStr === correctStr;
          
          // Highlight correct answer
          if (isCorrect) {
            doc.setFillColor(220, 252, 231);
            doc.roundedRect(margin + 12, yPosition - 4, contentWidth - 17, 7, 1, 1, 'F');
          }
          
          const optionLines = doc.splitTextToSize(`${optionLabel}) ${optionStr}`, contentWidth - 20);
          
          if (isCorrect) {
            doc.setTextColor(22, 163, 74);
            doc.setFont('helvetica', 'bold');
          } else {
            doc.setTextColor(75, 85, 99);
            doc.setFont('helvetica', 'normal');
          }
          
          addTextWithEncoding(doc, optionLines, margin + 15, yPosition);
          yPosition += optionLines.length * 5 + 2;
        });
      }

      // Answer key section
      const decodedCorrectAnswer = decodeHTMLEntities(question.correctAnswer);
      const correctAnswerStr = String(decodedCorrectAnswer);
      
      const decodedExplanation = decodeHTMLEntities(question.explanation || 'No explanation provided');
      const explanationStr = String(decodedExplanation);
      
      // Calculate proper text wrapping for explanation
      const explanationLines = doc.splitTextToSize(explanationStr, contentWidth - 25);
      
      // Calculate box height based on actual content
      const boxHeight = 12 + (explanationLines.length * 5);
      
      // Check if we need a new page for the answer box
      if (yPosition + boxHeight > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Draw answer box
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(34, 197, 94);
      doc.roundedRect(margin + 12, yPosition, contentWidth - 17, boxHeight, 1, 1, 'FD');
      
      // Correct answer
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(22, 163, 74);
      doc.text('Correct Answer:', margin + 15, yPosition + 5);
      addTextWithEncoding(doc, correctAnswerStr, margin + 45, yPosition + 5);
      
      // Explanation label
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(34, 139, 34);
      doc.text('Explanation:', margin + 15, yPosition + 11);
      
      // Explanation text with proper wrapping
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      
      // Render each line of explanation
      explanationLines.forEach((line: string, lineIndex: number) => {
        addTextWithEncoding(doc, line, margin + 15, yPosition + 16 + (lineIndex * 5));
      });
      
      yPosition += boxHeight + 8;
    });

    // Footer on all pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Page ${i} of ${totalPages} | Generated by AssessAI | ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${exam.title.replace(/\s+/g, '_')}_Question_Paper.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
