import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET single exam by ID - for student access (no teacher filtering)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: examId } = await params;

    // Fetch all exams and find the one with matching ID
    const exams = await db.exams.getAll();
    const exam = exams.find(e => e.id === examId);

    if (!exam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(exam);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exam' },
      { status: 500 }
    );
  }
}
