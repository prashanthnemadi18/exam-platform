// Supabase database layer
import { supabase } from './supabase';

// TypeScript interfaces
export interface IStudent {
  id: string;
  name: string;
  usn: string;
  semester: string;
  email: string;
  registeredAt: string;
  teacherId?: string;
}

export interface IQuestion {
  questionText: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface IExam {
  id: string;
  title: string;
  subject: string;
  topic: string;
  difficulty: string;
  questionType: string;
  numberOfQuestions: number;
  duration: number;
  questions: IQuestion[];
  createdAt: string;
  createdBy: string;
  teacherId?: string;
}

export interface IAnswer {
  questionIndex: number;
  answer: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface ISubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  studentUSN: string;
  studentEmail: string;
  answers: IAnswer[];
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

export const supabaseDb = {
  students: {
    getAll: async (): Promise<IStudent[]> => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('registeredAt', { ascending: false });

      if (error) {
        console.error('Error fetching students:', error);
        throw error;
      }

      return data || [];
    },

    add: async (student: IStudent): Promise<IStudent> => {
      const { data, error } = await supabase
        .from('students')
        .insert([student])
        .select()
        .single();

      if (error) {
        console.error('Error adding student:', error);
        throw error;
      }

      return data;
    },

    findById: async (id: string): Promise<IStudent | null> => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        console.error('Error finding student:', error);
        throw error;
      }

      return data;
    },

    getByTeacherId: async (teacherId: string): Promise<IStudent[]> => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('teacherId', teacherId)
        .order('registeredAt', { ascending: false });

      if (error) {
        console.error('Error fetching students by teacher:', error);
        throw error;
      }

      return data || [];
    },

    deleteByTeacherId: async (teacherId: string): Promise<void> => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('teacherId', teacherId);

      if (error) {
        console.error('Error deleting students:', error);
        throw error;
      }
    },
  },

  exams: {
    getAll: async (): Promise<IExam[]> => {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Error fetching exams:', error);
        throw error;
      }

      return data || [];
    },

    add: async (exam: IExam): Promise<IExam> => {
      const { data, error } = await supabase
        .from('exams')
        .insert([exam])
        .select()
        .single();

      if (error) {
        console.error('Error adding exam:', error);
        throw error;
      }

      return data;
    },

    findById: async (id: string): Promise<IExam | null> => {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        console.error('Error finding exam:', error);
        throw error;
      }

      return data;
    },

    getByTeacherId: async (teacherId: string): Promise<IExam[]> => {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('teacherId', teacherId)
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Error fetching exams by teacher:', error);
        throw error;
      }

      return data || [];
    },

    deleteByTeacherId: async (teacherId: string): Promise<void> => {
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('teacherId', teacherId);

      if (error) {
        console.error('Error deleting exams:', error);
        throw error;
      }
    },
  },

  submissions: {
    getAll: async (): Promise<ISubmission[]> => {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('submittedAt', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
        throw error;
      }

      return data || [];
    },

    add: async (submission: ISubmission): Promise<ISubmission> => {
      const { data, error } = await supabase
        .from('submissions')
        .insert([submission])
        .select()
        .single();

      if (error) {
        console.error('Error adding submission:', error);
        throw error;
      }

      return data;
    },

    findByExamId: async (examId: string): Promise<ISubmission[]> => {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('examId', examId)
        .order('submittedAt', { ascending: false });

      if (error) {
        console.error('Error fetching submissions by exam:', error);
        throw error;
      }

      return data || [];
    },

    getByTeacherId: async (teacherId: string): Promise<ISubmission[]> => {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('teacherId', teacherId)
        .order('submittedAt', { ascending: false });

      if (error) {
        console.error('Error fetching submissions by teacher:', error);
        throw error;
      }

      return data || [];
    },

    deleteByTeacherId: async (teacherId: string): Promise<void> => {
      const { error } = await supabase
        .from('submissions')
        .delete()
        .eq('teacherId', teacherId);

      if (error) {
        console.error('Error deleting submissions:', error);
        throw error;
      }
    },
  },

  clearTeacherData: async (teacherId: string): Promise<void> => {
    await supabaseDb.students.deleteByTeacherId(teacherId);
    await supabaseDb.exams.deleteByTeacherId(teacherId);
    await supabaseDb.submissions.deleteByTeacherId(teacherId);
  },
};
