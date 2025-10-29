import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all submissions
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const examId = searchParams.get('examId');
        
        const submissions = await db.submissions.getAll();
        
        if (examId) {
            const filtered = submissions.filter(s => s.examId === examId);
            return NextResponse.json(filtered);
        }
        
        return NextResponse.json(submissions);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }
}

// POST - Submit exam answers
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        const newSubmission = {
            ...body,
            id: Date.now().toString(36) + Math.random().toString(36).substring(2),
            submittedAt: new Date().toISOString(),
        };
        
        await db.submissions.add(newSubmission);
        
        return NextResponse.json(newSubmission, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
    }
}
