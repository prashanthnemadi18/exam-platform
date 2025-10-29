import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all students
export async function GET() {
    try {
        const students = await db.students.getAll();
        return NextResponse.json(students);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
    }
}

// POST - Add new student
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const newStudent = {
            ...body,
            id: Date.now().toString(36) + Math.random().toString(36).substring(2),
            registeredAt: new Date().toISOString(),
        };

        await db.students.add(newStudent);

        return NextResponse.json(newStudent, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to save student' }, { status: 500 });
    }
}
