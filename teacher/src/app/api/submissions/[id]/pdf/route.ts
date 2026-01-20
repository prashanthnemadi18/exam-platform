/**
 * API Route: Generate PDF for individual student submission
 * GET /api/submissions/[id]/pdf
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateStudentPDF, downloadPDF } from '@/lib/pdf-generator';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: submissionId } = await params;

    // Fetch submission data
    const submissions = await db.submissions.getAll();
    const submission = submissions.find(s => s.id === submissionId);

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Fetch exam data
    const exams = await db.exams.getAll();
    const exam = exams.find(e => e.id === submission.examId);

    if (!exam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    // Prepare data for PDF generation
    const studentResult = {
      studentName: submission.studentName,
      studentUSN: submission.studentUSN,
      studentEmail: submission.studentEmail || 'N/A',
      score: submission.score,
      totalQuestions: submission.totalQuestions,
      percentage: (submission.score / submission.totalQuestions) * 100,
      submittedAt: submission.submittedAt,
      answers: submission.answers,
    };

    const examData = {
      title: exam.title,
      subject: exam.subject,
      topic: exam.topic,
      difficulty: exam.difficulty,
      questions: exam.questions,
    };

    // Generate PDF
    const doc = generateStudentPDF(studentResult, examData);
    const pdfBuffer = doc.output('arraybuffer');

    // Return PDF as downloadable file
    const filename = `${submission.studentName.replace(/\s+/g, '_')}_${exam.title.replace(/\s+/g, '_')}_Result.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
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
