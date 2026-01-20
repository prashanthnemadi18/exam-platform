// In-memory storage only - no database
import { fileStorage } from './file-storage';

interface Student {
  id: string;
  name: string;
  usn: string;
  semester: string;
  email: string;
  registeredAt: string;
  teacherId?: string;
}

interface Exam {
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
  teacherId?: string;
}

interface Submission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  studentUSN: string;
  studentEmail: string;
  answers: any[];
  score: number;
  totalQuestions: number;
  submittedAt: string;
  wasTerminated?: boolean;
  timeRemaining?: number;
  tabSwitchCount?: number;
  terminationReason?: string;
  cheatingDetected?: boolean;
  teacherId?: string;
}

export const db = {
  students: {
    getAll: async (): Promise<Student[]> => {
      return fileStorage.students.getAll();
    },
    add: async (student: Student): Promise<Student> => {
      return fileStorage.students.add(student);
    },
    findById: async (id: string): Promise<Student | null> => {
      return fileStorage.students.findById(id);
    },
    getByTeacherId: async (teacherId: string): Promise<Student[]> => {
      return fileStorage.students.getByTeacherId(teacherId);
    },
    deleteByTeacherId: async (teacherId: string): Promise<void> => {
      return fileStorage.students.deleteByTeacherId(teacherId);
    },
  },
  exams: {
    getAll: async (): Promise<Exam[]> => {
      return fileStorage.exams.getAll();
    },
    add: async (exam: Exam): Promise<Exam> => {
      return fileStorage.exams.add(exam);
    },
    findById: async (id: string): Promise<Exam | null> => {
      return fileStorage.exams.findById(id);
    },
    getByTeacherId: async (teacherId: string): Promise<Exam[]> => {
      return fileStorage.exams.getByTeacherId(teacherId);
    },
    deleteByTeacherId: async (teacherId: string): Promise<void> => {
      return fileStorage.exams.deleteByTeacherId(teacherId);
    },
  },
  submissions: {
    getAll: async (): Promise<Submission[]> => {
      return fileStorage.submissions.getAll();
    },
    add: async (submission: Submission): Promise<Submission> => {
      return fileStorage.submissions.add(submission);
    },
    findByExamId: async (examId: string): Promise<Submission[]> => {
      return fileStorage.submissions.findByExamId(examId);
    },
    getByTeacherId: async (teacherId: string): Promise<Submission[]> => {
      return fileStorage.submissions.getByTeacherId(teacherId);
    },
    deleteByTeacherId: async (teacherId: string): Promise<void> => {
      return fileStorage.submissions.deleteByTeacherId(teacherId);
    },
  },
  clearTeacherData: async (teacherId: string): Promise<void> => {
    await db.students.deleteByTeacherId(teacherId);
    await db.exams.deleteByTeacherId(teacherId);
    await db.submissions.deleteByTeacherId(teacherId);
  },
};
