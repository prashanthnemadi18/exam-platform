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
}

// Storage keys
const STUDENTS_KEY = 'assessai_students';
const EXAMS_KEY = 'assessai_exams';
const SUBMISSIONS_KEY = 'assessai_submissions';

// Student functions
export async function saveStudent(student: Omit<Student, 'id' | 'registeredAt'>): Promise<Student> {
  try {
    const response = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
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
    const response = await fetch('/api/students', {
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
    const response = await fetch('/api/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exam),
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
    const response = await fetch('/api/exams', {
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

// Submission functions - keeping localStorage for now (can be migrated later)
export function saveSubmission(submission: Omit<ExamSubmission, 'id' | 'submittedAt'>): ExamSubmission {
  const submissions = getSubmissions();
  const newSubmission: ExamSubmission = {
    ...submission,
    id: generateId(),
    submittedAt: new Date().toISOString(),
  };
  submissions.push(newSubmission);
  if (typeof window !== 'undefined') {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
  }
  return newSubmission;
}

export function getSubmissions(): ExamSubmission[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(SUBMISSIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getSubmissionsByExamId(examId: string): ExamSubmission[] {
  const submissions = getSubmissions();
  return submissions.filter(s => s.examId === examId);
}

export function getSubmissionsByStudentId(studentId: string): ExamSubmission[] {
  const submissions = getSubmissions();
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
