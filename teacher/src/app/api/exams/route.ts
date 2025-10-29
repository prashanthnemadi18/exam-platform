import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const exams = await db.exams.getAll();
    return NextResponse.json(exams);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newExam = {
      ...body,
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      createdAt: new Date().toISOString(),
    };
    
    await db.exams.add(newExam);
    
    return NextResponse.json(newExam, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to save exam' }, { status: 500 });
  }
}
