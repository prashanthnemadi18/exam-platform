import { NextResponse } from 'next/server';

/**
 * This endpoint is no longer needed with in-memory storage
 * All data is temporary and deleted on logout
 */
export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'No cleanup needed - using in-memory storage',
    removed: {
      students: 0,
      exams: 0,
      submissions: 0,
    },
    remaining: {
      students: 0,
      exams: 0,
      submissions: 0,
    },
  });
}
