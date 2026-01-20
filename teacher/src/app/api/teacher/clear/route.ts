import { NextRequest, NextResponse } from 'next/server';
import { fileStorage } from '@/lib/file-storage';

export async function POST(request: NextRequest) {
  try {
    const { teacherId } = await request.json();
    
    if (!teacherId) {
      return NextResponse.json({ error: 'Teacher ID required' }, { status: 400 });
    }

    // Clear all data for this teacher
    await fileStorage.clearTeacherData(teacherId);
    
    return NextResponse.json({ success: true, message: 'Teacher data cleared' });
  } catch (error) {
    console.error('Clear teacher data error:', error);
    return NextResponse.json({ error: 'Failed to clear data' }, { status: 500 });
  }
}
