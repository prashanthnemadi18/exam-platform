import { NextRequest, NextResponse } from 'next/server';

/**
 * This endpoint is no longer needed with in-memory storage
 * All data is temporary and deleted on logout
 */
export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'No fix needed - using in-memory storage',
    fixed: {
      exams: 0,
      submissions: 0,
      students: 0
    }
  });
}
