/**
 * In-memory storage for exams, students, and submissions
 * Data is temporary and deleted when app closes
 */

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

// In-memory storage - data is lost when app closes
let inMemoryStudents: Student[] = [];
let inMemoryExams: Exam[] = [];
let inMemorySubmissions: Submission[] = [];

export const fileStorage = {
  students: {
    getAll: (): Student[] => inMemoryStudents,
    add: (student: Student): Student => {
      inMemoryStudents.push(student);
      return student;
    },
    findById: (id: string): Student | null => {
      return inMemoryStudents.find((s) => s.id === id) || null;
    },
    getByTeacherId: (teacherId: string): Student[] => {
      return inMemoryStudents.filter((s) => s.teacherId === teacherId);
    },
    deleteByTeacherId: (teacherId: string): void => {
      inMemoryStudents = inMemoryStudents.filter((s) => s.teacherId !== teacherId);
    },
  },
  exams: {
    getAll: (): Exam[] => inMemoryExams,
    add: (exam: Exam): Exam => {
      inMemoryExams.push(exam);
      return exam;
    },
    findById: (id: string): Exam | null => {
      return inMemoryExams.find((e) => e.id === id) || null;
    },
    getByTeacherId: (teacherId: string): Exam[] => {
      return inMemoryExams.filter((e) => e.teacherId === teacherId);
    },
    deleteByTeacherId: (teacherId: string): void => {
      inMemoryExams = inMemoryExams.filter((e) => e.teacherId !== teacherId);
    },
  },
  submissions: {
    getAll: (): Submission[] => inMemorySubmissions,
    add: (submission: Submission): Submission => {
      inMemorySubmissions.push(submission);
      return submission;
    },
    findByExamId: (examId: string): Submission[] => {
      return inMemorySubmissions.filter((s) => s.examId === examId);
    },
    getByTeacherId: (teacherId: string): Submission[] => {
      return inMemorySubmissions.filter((s) => s.teacherId === teacherId);
    },
    deleteByTeacherId: (teacherId: string): void => {
      inMemorySubmissions = inMemorySubmissions.filter((s) => s.teacherId !== teacherId);
    },
  },
  clearTeacherData: (teacherId: string): void => {
    fileStorage.students.deleteByTeacherId(teacherId);
    fileStorage.exams.deleteByTeacherId(teacherId);
    fileStorage.submissions.deleteByTeacherId(teacherId);
  },
};
