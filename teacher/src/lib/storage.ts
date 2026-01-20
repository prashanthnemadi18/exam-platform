// Simple storage utility for demo purposes
// In production, this would be replaced with a real database

export interface Student {
  id: string;
  name: string;
  usn: string;
  semester: string;
  email: string;
  registeredAt: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  topic: string;
  difficulty: string;
  questionType: string;
  numberOfQuestions: number;
  duration: number;
  questions: any[];
  createdAt: string;
  createdBy: string;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  studentUSN: string;
  answers: any[];
  score: number;
  totalQuestions: number;
  submittedAt: string;
  wasTerminated?: boolean;
  timeRemaining?: number;
  tabSwitchCount?: number;
  terminationReason?: string;
  cheatingDetected?: boolean;
}

// Storage keys
const STUDENTS_KEY = 'assessai_students';
const EXAMS_KEY = 'assessai_exams';
const SUBMISSIONS_KEY = 'assessai_submissions';

// Student functions
export async function saveStudent(student: Omit<Student, 'id' | 'registeredAt'>): Promise<Student> {
  try {
    const teacherId = typeof window !== 'undefined' ? localStorage.getItem('teacherId') : null;
    
    const response = await fetch('/api/students', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(teacherId && { 'x-teacher-id': teacherId })
      },
      body: JSON.stringify({ ...student, teacherId }),
    });
    
    if (!response.ok) throw new Error('Failed to save student');
    return await response.json();
  } catch (error) {
    console.error('Error saving student:', error);
    throw error;
  }
}

export async function getStudents(): Promise<Student[]> {
  try {
    const teacherId = typeof window !== 'undefined' ? localStorage.getItem('teacherId') : null;
    const url = teacherId ? `/api/students?teacherId=${teacherId}` : '/api/students';
    
    const response = await fetch(url, {
      cache: 'no-store',
    });
    
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
}

export async function getStudentById(id: string): Promise<Student | null> {
  const students = await getStudents();
  return students.find(s => s.id === id) || null;
}

// Exam functions
export async function saveExam(exam: Omit<Exam, 'id' | 'createdAt'>): Promise<Exam> {
  try {
    const teacherId = typeof window !== 'undefined' ? localStorage.getItem('teacherId') : null;
    
    const response = await fetch('/api/exams', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(teacherId && { 'x-teacher-id': teacherId })
      },
      body: JSON.stringify({ ...exam, teacherId }),
    });
    
    if (!response.ok) throw new Error('Failed to save exam');
    return await response.json();
  } catch (error) {
    console.error('Error saving exam:', error);
    throw error;
  }
}

export async function getExams(): Promise<Exam[]> {
  try {
    const teacherId = typeof window !== 'undefined' ? localStorage.getItem('teacherId') : null;
    const url = teacherId ? `/api/exams?teacherId=${teacherId}` : '/api/exams';
    
    const response = await fetch(url, {
      cache: 'no-store',
    });
    
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching exams:', error);
    return [];
  }
}

export async function getExamById(id: string): Promise<Exam | null> {
  const exams = await getExams();
  return exams.find(e => e.id === id) || null;
}

// Submission functions - using API for teacher-filtered submissions
export async function saveSubmission(submission: Omit<ExamSubmission, 'id' | 'submittedAt'>): Promise<ExamSubmission> {
  try {
    const teacherId = typeof window !== 'undefined' ? localStorage.getItem('teacherId') : null;
    
    const newSubmission = {
      ...submission,
      teacherId: teacherId || undefined,
    };

    const response = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSubmission),
    });
    
    if (!response.ok) throw new Error('Failed to save submission');
    return await response.json();
  } catch (error) {
    console.error('Error saving submission:', error);
    throw error;
  }
}

export async function getSubmissions(): Promise<ExamSubmission[]> {
  try {
    const teacherId = typeof window !== 'undefined' ? localStorage.getItem('teacherId') : null;
    const url = teacherId ? `/api/submissions?teacherId=${teacherId}` : '/api/submissions';
    
    const response = await fetch(url, {
      cache: 'no-store',
    });
    
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return [];
  }
}

export async function getSubmissionsByExamId(examId: string): Promise<ExamSubmission[]> {
  const submissions = await getSubmissions();
  return submissions.filter(s => s.examId === examId);
}

export async function getSubmissionsByStudentId(studentId: string): Promise<ExamSubmission[]> {
  const submissions = await getSubmissions();
  return submissions.filter(s => s.studentId === studentId);
}

// Utility functions
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Get public URL (works on mobile)
export function getPublicUrl(): string {
  if (typeof window === 'undefined') return 'http://localhost:3003';
  
  // Always use current origin - works on same computer
  return window.location.origin;
}

// Generate shareable links
export function generateRegistrationLink(): string {
  const baseUrl = getPublicUrl();
  return `${baseUrl}/register`;
}

export function generateExamLink(examId: string): string {
  const baseUrl = getPublicUrl();
  return `${baseUrl}/exam/${examId}`;
}
