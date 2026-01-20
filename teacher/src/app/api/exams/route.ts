import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const teacherId = request.headers.get('x-teacher-id') || request.nextUrl.searchParams.get('teacherId');
    
    const exams = await db.exams.getAll();
    
    // Always filter by teacherId - only show exams with matching teacherId
    if (teacherId) {
      const filtered = exams.filter(e => e.teacherId === teacherId);
      return NextResponse.json(filtered);
    }
    
    // If no teacherId provided, return empty array (don't show orphaned data)
    return NextResponse.json([]);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get teacher ID from headers or body
    const teacherId = request.headers.get('x-teacher-id') || body.teacherId;
    
    const newExam = {
      ...body,
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      createdAt: new Date().toISOString(),
      teacherId: teacherId || undefined,
    };
    
    await db.exams.add(newExam);
    
    return NextResponse.json(newExam, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to save exam' }, { status: 500 });
  }
}
