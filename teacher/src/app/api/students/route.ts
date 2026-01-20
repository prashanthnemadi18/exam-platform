import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all students (filtered by teacher if teacherId provided)
export async function GET(request: NextRequest) {
    try {
        const teacherId = request.headers.get('x-teacher-id') || request.nextUrl.searchParams.get('teacherId');
        const bypassFilter = request.nextUrl.searchParams.get('bypassTeacherFilter');
        
        const students = await db.students.getAll();
        
        // If bypass flag is set (for student login verification), return all students
        if (bypassFilter === 'true') {
            return NextResponse.json(students);
        }
        
        // Always filter by teacherId - only show students with matching teacherId
        if (teacherId) {
            const filtered = students.filter(s => s.teacherId === teacherId);
            return NextResponse.json(filtered);
        }
        
        // If no teacherId provided, return empty array (don't show orphaned data)
        return NextResponse.json([]);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
    }
}

// POST - Add new student
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Get teacher ID from headers or body
        const teacherId = request.headers.get('x-teacher-id') || body.teacherId;

        const newStudent = {
            ...body,
            id: Date.now().toString(36) + Math.random().toString(36).substring(2),
            registeredAt: new Date().toISOString(),
            teacherId: teacherId || undefined,
        };

        await db.students.add(newStudent);

        return NextResponse.json(newStudent, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to save student' }, { status: 500 });
    }
}
