/**
 * PDF Generation Utilities
 * Generates PDF reports for exam results
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Decode HTML entities to plain text and normalize for PDF
 * Handles multiple levels of encoding
 */
function decodeHTMLEntities(text: string): string {
  if (!text) return '';
  
  let decoded: string;
  
  if (typeof window === 'undefined') {
    // Server-side decoding with multiple passes for double-encoded entities
    decoded = text;
    let previousDecoded = '';
    let iterations = 0;
    const maxIterations = 5; // Prevent infinite loops
    
    // Keep decoding until no more changes occur or max iterations reached
    while (decoded !== previousDecoded && iterations < maxIterations) {
      previousDecoded = decoded;
      
      // Decode numeric entities first (both decimal and hex)
      decoded = decoded
        .replace(/&#(\d+);/g, (_match, dec) => String.fromCharCode(dec))
        .replace(/&#x([0-9a-f]+);/gi, (_match, hex) => String.fromCharCode(parseInt(hex, 16)))
        // Decode named entities (but NOT &amp; yet)
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
        // Decode &amp; LAST to avoid double-decoding issues
        .replace(/&amp;/g, '&');
      
      iterations++;
    }
  } else {
    // Client-side decoding using DOM (handles all entities automatically)
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    decoded = textarea.value;
    
    // If still has entities, try one more time
    if (decoded.includes('&')) {
      textarea.innerHTML = decoded;
      decoded = textarea.value;
    }
  }
  
  // Normalize whitespace and remove any zero-width characters
  decoded = decoded
    .replace(/\u200B/g, '') // Zero-width space
    .replace(/\u200C/g, '') // Zero-width non-joiner
    .replace(/\u200D/g, '') // Zero-width joiner
    .replace(/\uFEFF/g, '') // Zero-width no-break space
    .trim();
  
  return decoded;
}

export interface StudentResult {
  studentName: string;
  studentUSN: string;
  studentEmail: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  submittedAt: string;
  answers: Array<{
    questionIndex: number;
    answer: string;
    isCorrect: boolean;
    explanation?: string;
  }>;
}

export interface ExamData {
  title: string;
  subject: string;
  topic: string;
  difficulty: string;
  questions: Array<{
    questionText: string;
    options?: string[];
    correctAnswer: string;
    explanation?: string;
  }>;
}

/**
 * Generate PDF for individual student result
 */
export function generateStudentPDF(
  studentResult: StudentResult,
  examData: ExamData
): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Exam Result Report', pageWidth / 2, 20, { align: 'center' });
  
  // Exam Details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Exam: ${examData.title}`, 20, 35);
  doc.text(`Subject: ${examData.subject}`, 20, 42);
  doc.text(`Topic: ${examData.topic}`, 20, 49);
  doc.text(`Difficulty: ${examData.difficulty}`, 20, 56);
  
  // Student Details
  doc.setFont('helvetica', 'bold');
  doc.text('Student Information', 20, 70);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${studentResult.studentName}`, 20, 77);
  doc.text(`USN: ${studentResult.studentUSN}`, 20, 84);
  doc.text(`Email: ${studentResult.studentEmail}`, 20, 91);
  doc.text(`Submitted: ${new Date(studentResult.submittedAt).toLocaleString()}`, 20, 98);
  
  // Score Summary
  doc.setFont('helvetica', 'bold');
  doc.text('Score Summary', 20, 112);
  doc.setFontSize(16);
  if (studentResult.percentage >= 60) {
    doc.setTextColor(0, 128, 0); // Green for pass
  } else {
    doc.setTextColor(255, 0, 0); // Red for fail
  }
  doc.text(
    `${studentResult.score} / ${studentResult.totalQuestions} (${studentResult.percentage.toFixed(1)}%)`,
    20,
    122
  );
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  
  // Question-by-Question Breakdown with Explanations
  doc.setFont('helvetica', 'bold');
  doc.text('Detailed Results with AI Explanations', 20, 136);
  
  let currentY = 145;
  
  studentResult.answers.forEach((answer, index) => {
    const question = examData.questions[answer.questionIndex];
    const questionNum = index + 1;
    
    // Check if we need a new page
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    // Question Number and Status
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    const statusText = answer.isCorrect ? '✓ CORRECT' : '✗ INCORRECT';
    const statusColor = answer.isCorrect ? [0, 128, 0] : [255, 0, 0];
    
    doc.text(`Question ${questionNum}:`, 20, currentY);
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(statusText, 50, currentY);
    doc.setTextColor(0, 0, 0);
    currentY += 7;
    
    // Question Text
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const decodedQuestion = decodeHTMLEntities(question.questionText);
    const questionStr = String(decodedQuestion);
    const questionLines = doc.splitTextToSize(questionStr, 170);
    doc.text(questionLines, 20, currentY);
    currentY += questionLines.length * 5 + 3;
    
    // Options (if available)
    if (question.options && question.options.length > 0) {
      doc.setFontSize(9);
      question.options.forEach((option, optIndex) => {
        const decodedOption = String(decodeHTMLEntities(option));
        const decodedStudentAnswer = String(decodeHTMLEntities(answer.answer));
        const decodedCorrectAnswer = String(decodeHTMLEntities(question.correctAnswer));
        const optionLabel = String.fromCharCode(65 + optIndex); // A, B, C, D
        const isStudentAnswer = decodedStudentAnswer === decodedOption;
        const isCorrectAnswer = decodedCorrectAnswer === decodedOption;
        
        if (isCorrectAnswer) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 128, 0);
        } else if (isStudentAnswer && !isCorrectAnswer) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(255, 0, 0);
        } else {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(100, 100, 100);
        }
        
        const optionText = `${optionLabel}) ${decodedOption}`;
        const optionLines = doc.splitTextToSize(optionText, 165);
        doc.text(optionLines, 25, currentY);
        currentY += optionLines.length * 4.5;
        
        doc.setTextColor(0, 0, 0);
      });
      currentY += 2;
    } else {
      // For non-MCQ questions
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Your Answer:', 25, currentY);
      doc.setFont('helvetica', 'normal');
      currentY += 5;
      const decodedAnswer = String(decodeHTMLEntities(answer.answer));
      const answerLines = doc.splitTextToSize(decodedAnswer, 165);
      doc.text(answerLines, 25, currentY);
      currentY += answerLines.length * 4.5 + 2;
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 128, 0);
      doc.text('Correct Answer:', 25, currentY);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      currentY += 5;
      const decodedCorrect = String(decodeHTMLEntities(question.correctAnswer));
      const correctLines = doc.splitTextToSize(decodedCorrect, 165);
      doc.text(correctLines, 25, currentY);
      currentY += correctLines.length * 4.5 + 2;
    }
    
    // AI Explanation
    const decodedCorrectForExplanation = String(decodeHTMLEntities(question.correctAnswer));
    const explanation = question.explanation || answer.explanation || 
      (answer.isCorrect 
        ? 'Great job! Your answer is correct.' 
        : `The correct answer is "${decodedCorrectForExplanation}". Please review this topic for better understanding.`);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bolditalic');
    doc.setTextColor(0, 102, 204);
    doc.text('💡 AI Explanation:', 25, currentY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'italic');
    currentY += 5;
    
    const decodedExplanation = String(decodeHTMLEntities(explanation));
    const explanationLines = doc.splitTextToSize(decodedExplanation, 165);
    doc.text(explanationLines, 25, currentY);
    currentY += explanationLines.length * 4.5 + 8;
    
    // Separator line
    if (index < studentResult.answers.length - 1) {
      doc.setDrawColor(200, 200, 200);
      doc.line(20, currentY, 190, currentY);
      currentY += 8;
    }
  });
  
  // Footer on all pages
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(128, 128, 128);
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Generated on ${new Date().toLocaleString()} | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  doc.setTextColor(0, 0, 0);
  
  return doc;
}

/**
 * Generate combined PDF for all students in a class
 */
export function generateClassPDF(
  results: StudentResult[],
  examData: ExamData
): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Summary Page
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Class Exam Results', pageWidth / 2, 20, { align: 'center' });
  
  // Exam Details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Exam: ${examData.title}`, 20, 35);
  doc.text(`Subject: ${examData.subject}`, 20, 42);
  doc.text(`Topic: ${examData.topic}`, 20, 49);
  doc.text(`Difficulty: ${examData.difficulty}`, 20, 56);
  doc.text(`Total Students: ${results.length}`, 20, 63);
  
  // Statistics
  const scores = results.map(r => r.percentage);
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  const highest = Math.max(...scores);
  const lowest = Math.min(...scores);
  const passed = scores.filter(s => s >= 60).length;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Class Statistics', 20, 77);
  doc.setFont('helvetica', 'normal');
  doc.text(`Average Score: ${average.toFixed(1)}%`, 20, 84);
  doc.text(`Highest Score: ${highest.toFixed(1)}%`, 20, 91);
  doc.text(`Lowest Score: ${lowest.toFixed(1)}%`, 20, 98);
  doc.text(`Pass Rate: ${passed}/${results.length} (${((passed/results.length)*100).toFixed(1)}%)`, 20, 105);
  
  // Summary Table
  doc.setFont('helvetica', 'bold');
  doc.text('Student Results Summary', 20, 119);
  
  const summaryData = results
    .sort((a, b) => b.percentage - a.percentage)
    .map((result, index) => [
      (index + 1).toString(),
      result.studentName,
      result.studentUSN,
      `${result.score}/${result.totalQuestions}`,
      `${result.percentage.toFixed(1)}%`,
      result.percentage >= 60 ? 'Pass' : 'Fail'
    ]);
  
  autoTable(doc, {
    startY: 125,
    head: [['Rank', 'Name', 'USN', 'Score', 'Percentage', 'Status']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [66, 139, 202] },
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 50 },
      2: { cellWidth: 35 },
      3: { cellWidth: 25 },
      4: { cellWidth: 30 },
      5: { cellWidth: 25 }
    },
    didParseCell: function(data) {
      if (data.column.index === 5 && data.section === 'body') {
        if (data.cell.text[0] === 'Pass') {
          data.cell.styles.textColor = [0, 128, 0];
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [255, 0, 0];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });
  
  // Add individual student pages with detailed explanations
  results.forEach((result, studentIndex) => {
    doc.addPage();
    
    // Student Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Student ${studentIndex + 1}: ${result.studentName}`, 20, 20);
    
    // Student Details
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`USN: ${result.studentUSN}`, 20, 30);
    
    const scoreColor = result.percentage >= 60 ? [0, 128, 0] : [255, 0, 0];
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`Score: ${result.score}/${result.totalQuestions} (${result.percentage.toFixed(1)}%)`, 20, 37);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(`Submitted: ${new Date(result.submittedAt).toLocaleString()}`, 20, 44);
    
    // Detailed Question Results with Explanations
    let currentY = 55;
    
    result.answers.forEach((answer, index) => {
      const question = examData.questions[answer.questionIndex];
      const questionNum = index + 1;
      
      // Check if we need a new page
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }
      
      // Question Number and Status
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      const statusText = answer.isCorrect ? '✓' : '✗';
      const statusColor = answer.isCorrect ? [0, 128, 0] : [255, 0, 0];
      
      doc.text(`Q${questionNum}:`, 20, currentY);
      doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.text(statusText, 30, currentY);
      doc.setTextColor(0, 0, 0);
      currentY += 6;
      
      // Question Text (shortened for class PDF)
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const decodedQuestionText = String(decodeHTMLEntities(question.questionText));
      const questionLines = doc.splitTextToSize(
        decodedQuestionText.substring(0, 150) + (decodedQuestionText.length > 150 ? '...' : ''),
        165
      );
      doc.text(questionLines, 22, currentY);
      currentY += questionLines.length * 4 + 2;
      
      // Answer comparison
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('Student:', 22, currentY);
      doc.setFont('helvetica', 'normal');
      const decodedStudentAns = String(decodeHTMLEntities(answer.answer));
      doc.text(decodedStudentAns.substring(0, 40), 42, currentY);
      currentY += 4;
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 128, 0);
      doc.text('Correct:', 22, currentY);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      const decodedCorrectAns = String(decodeHTMLEntities(question.correctAnswer));
      doc.text(decodedCorrectAns.substring(0, 40), 42, currentY);
      currentY += 5;
      
      // Brief explanation
      if (!answer.isCorrect) {
        const explanation = question.explanation || 'Review this topic for better understanding.';
        const decodedExpl = String(decodeHTMLEntities(explanation));
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        const explLines = doc.splitTextToSize(decodedExpl.substring(0, 100) + '...', 165);
        doc.text(explLines, 22, currentY);
        currentY += explLines.length * 3.5 + 2;
        doc.setTextColor(0, 0, 0);
      }
      
      currentY += 3;
    });
  });
  
  // Footer on last page
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  return doc;
}

/**
 * Download PDF file
 */
export function downloadPDF(doc: jsPDF, filename: string): void {
  doc.save(filename);
}
