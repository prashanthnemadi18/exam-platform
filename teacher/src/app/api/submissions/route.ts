import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all submissions (filtered by teacher or exam)
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const examId = searchParams.get('examId');
        const teacherId = request.headers.get('x-teacher-id') || searchParams.get('teacherId');
        const bypassFilter = searchParams.get('bypassTeacherFilter');
        
        const submissions = await db.submissions.getAll();
        
        // If bypass flag is set (for student verification), return all submissions
        if (bypassFilter === 'true') {
            if (examId) {
                return NextResponse.json(submissions.filter(s => s.examId === examId));
            }
            return NextResponse.json(submissions);
        }
        
        // Always filter by teacherId if provided
        let filtered = submissions;
        
        if (teacherId) {
            filtered = filtered.filter(s => s.teacherId === teacherId);
        } else {
            // If no teacherId, return empty array (don't show orphaned data)
            return NextResponse.json([]);
        }
        
        if (examId) {
            filtered = filtered.filter(s => s.examId === examId);
        }
        
        return NextResponse.json(filtered);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }
}

// POST - Submit exam answers
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Get teacher ID from headers or body
        const teacherId = request.headers.get('x-teacher-id') || body.teacherId;
        
        const newSubmission = {
            ...body,
            id: Date.now().toString(36) + Math.random().toString(36).substring(2),
            submittedAt: new Date().toISOString(),
            teacherId: teacherId || undefined,
        };
        
        await db.submissions.add(newSubmission);
        
        return NextResponse.json(newSubmission, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
    }
}
