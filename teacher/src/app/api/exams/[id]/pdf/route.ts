/**
 * API Route: Generate combined PDF for all students in an exam
 * GET /api/exams/[id]/pdf
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateClassPDF } from '@/lib/pdf-generator';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: examId } = await params;

    // Fetch exam data
    const exams = await db.exams.getAll();
    const exam = exams.find(e => e.id === examId);

    if (!exam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    // Fetch all submissions for this exam
    const allSubmissions = await db.submissions.getAll();
    const examSubmissions = allSubmissions.filter(s => s.examId === examId);

    if (examSubmissions.length === 0) {
      return NextResponse.json(
        { error: 'No submissions found for this exam' },
        { status: 404 }
      );
    }

    // Prepare data for PDF generation
    const results = examSubmissions.map(submission => ({
      studentName: submission.studentName,
      studentUSN: submission.studentUSN,
      studentEmail: submission.studentEmail || 'N/A',
      score: submission.score,
      totalQuestions: submission.totalQuestions,
      percentage: (submission.score / submission.totalQuestions) * 100,
      submittedAt: submission.submittedAt,
      answers: submission.answers,
    }));

    const examData = {
      title: exam.title,
      subject: exam.subject,
      topic: exam.topic,
      difficulty: exam.difficulty,
      questions: exam.questions,
    };

    // Generate combined PDF
    const doc = generateClassPDF(results, examData);
    const pdfBuffer = doc.output('arraybuffer');

    // Return PDF as downloadable file
    const filename = `${exam.title.replace(/\s+/g, '_')}_All_Results.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating combined PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
