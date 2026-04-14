// MongoDB database layer
import { connectDB } from './mongodb';
import { Student, IStudent } from '@/models/Student';
import { Exam, IExam } from '@/models/Exam';
import { Submission, ISubmission } from '@/models/Submission';

export const db = {
  students: {
    getAll: async (): Promise<IStudent[]> => {
      await connectDB();
      const students = await Student.find({}).lean();
      return students.map(s => ({
        id: s.id,
        name: s.name,
        usn: s.usn,
        semester: s.semester,
        email: s.email,
        registeredAt: s.registeredAt,
        teacherId: s.teacherId,
      }));
    },
    add: async (student: IStudent): Promise<IStudent> => {
      await connectDB();
      const newStudent = await Student.create(student);
      return {
        id: newStudent.id,
        name: newStudent.name,
        usn: newStudent.usn,
        semester: newStudent.semester,
        email: newStudent.email,
        registeredAt: newStudent.registeredAt,
        teacherId: newStudent.teacherId,
      };
    },
    findById: async (id: string): Promise<IStudent | null> => {
      await connectDB();
      const student = await Student.findOne({ id }).lean();
      if (!student) return null;
      return {
        id: student.id,
        name: student.name,
        usn: student.usn,
        semester: student.semester,
        email: student.email,
        registeredAt: student.registeredAt,
        teacherId: student.teacherId,
      };
    },
    getByTeacherId: async (teacherId: string): Promise<IStudent[]> => {
      await connectDB();
      const students = await Student.find({ teacherId }).lean();
      return students.map(s => ({
        id: s.id,
        name: s.name,
        usn: s.usn,
        semester: s.semester,
        email: s.email,
        registeredAt: s.registeredAt,
        teacherId: s.teacherId,
      }));
    },
    deleteByTeacherId: async (teacherId: string): Promise<void> => {
      await connectDB();
      await Student.deleteMany({ teacherId });
    },
  },
  exams: {
    getAll: async (): Promise<IExam[]> => {
      await connectDB();
      const exams = await Exam.find({}).lean();
      return exams.map(e => ({
        id: e.id,
        title: e.title,
        subject: e.subject,
        topic: e.topic,
        difficulty: e.difficulty,
        questionType: e.questionType,
        numberOfQuestions: e.numberOfQuestions,
        duration: e.duration,
        questions: e.questions,
        createdAt: e.createdAt,
        createdBy: e.createdBy,
        teacherId: e.teacherId,
      }));
    },
    add: async (exam: IExam): Promise<IExam> => {
      await connectDB();
      const newExam = await Exam.create(exam);
      return {
        id: newExam.id,
        title: newExam.title,
        subject: newExam.subject,
        topic: newExam.topic,
        difficulty: newExam.difficulty,
        questionType: newExam.questionType,
        numberOfQuestions: newExam.numberOfQuestions,
        duration: newExam.duration,
        questions: newExam.questions,
        createdAt: newExam.createdAt,
        createdBy: newExam.createdBy,
        teacherId: newExam.teacherId,
      };
    },
    findById: async (id: string): Promise<IExam | null> => {
      await connectDB();
      const exam = await Exam.findOne({ id }).lean();
      if (!exam) return null;
      return {
        id: exam.id,
        title: exam.title,
        subject: exam.subject,
        topic: exam.topic,
        difficulty: exam.difficulty,
        questionType: exam.questionType,
        numberOfQuestions: exam.numberOfQuestions,
        duration: exam.duration,
        questions: exam.questions,
        createdAt: exam.createdAt,
        createdBy: exam.createdBy,
        teacherId: exam.teacherId,
      };
    },
    getByTeacherId: async (teacherId: string): Promise<IExam[]> => {
      await connectDB();
      const exams = await Exam.find({ teacherId }).lean();
      return exams.map(e => ({
        id: e.id,
        title: e.title,
        subject: e.subject,
        topic: e.topic,
        difficulty: e.difficulty,
        questionType: e.questionType,
        numberOfQuestions: e.numberOfQuestions,
        duration: e.duration,
        questions: e.questions,
        createdAt: e.createdAt,
        createdBy: e.createdBy,
        teacherId: e.teacherId,
      }));
    },
    deleteByTeacherId: async (teacherId: string): Promise<void> => {
      await connectDB();
      await Exam.deleteMany({ teacherId });
    },
  },
  submissions: {
    getAll: async (): Promise<ISubmission[]> => {
      await connectDB();
      const submissions = await Submission.find({}).lean();
      return submissions.map(s => ({
        id: s.id,
        examId: s.examId,
        studentId: s.studentId,
        studentName: s.studentName,
        studentUSN: s.studentUSN,
        studentEmail: s.studentEmail,
        answers: s.answers,
        score: s.score,
        totalQuestions: s.totalQuestions,
        submittedAt: s.submittedAt,
        wasTerminated: s.wasTerminated,
        timeRemaining: s.timeRemaining,
        tabSwitchCount: s.tabSwitchCount,
        terminationReason: s.terminationReason,
        cheatingDetected: s.cheatingDetected,
        teacherId: s.teacherId,
      }));
    },
    add: async (submission: ISubmission): Promise<ISubmission> => {
      await connectDB();
      const newSubmission = await Submission.create(submission);
      return {
        id: newSubmission.id,
        examId: newSubmission.examId,
        studentId: newSubmission.studentId,
        studentName: newSubmission.studentName,
        studentUSN: newSubmission.studentUSN,
        studentEmail: newSubmission.studentEmail,
        answers: newSubmission.answers,
        score: newSubmission.score,
        totalQuestions: newSubmission.totalQuestions,
        submittedAt: newSubmission.submittedAt,
        wasTerminated: newSubmission.wasTerminated,
        timeRemaining: newSubmission.timeRemaining,
        tabSwitchCount: newSubmission.tabSwitchCount,
        terminationReason: newSubmission.terminationReason,
        cheatingDetected: newSubmission.cheatingDetected,
        teacherId: newSubmission.teacherId,
      };
    },
    findByExamId: async (examId: string): Promise<ISubmission[]> => {
      await connectDB();
      const submissions = await Submission.find({ examId }).lean();
      return submissions.map(s => ({
        id: s.id,
        examId: s.examId,
        studentId: s.studentId,
        studentName: s.studentName,
        studentUSN: s.studentUSN,
        studentEmail: s.studentEmail,
        answers: s.answers,
        score: s.score,
        totalQuestions: s.totalQuestions,
        submittedAt: s.submittedAt,
        wasTerminated: s.wasTerminated,
        timeRemaining: s.timeRemaining,
        tabSwitchCount: s.tabSwitchCount,
        terminationReason: s.terminationReason,
        cheatingDetected: s.cheatingDetected,
        teacherId: s.teacherId,
      }));
    },
    getByTeacherId: async (teacherId: string): Promise<ISubmission[]> => {
      await connectDB();
      const submissions = await Submission.find({ teacherId }).lean();
      return submissions.map(s => ({
        id: s.id,
        examId: s.examId,
        studentId: s.studentId,
        studentName: s.studentName,
        studentUSN: s.studentUSN,
        studentEmail: s.studentEmail,
        answers: s.answers,
        score: s.score,
        totalQuestions: s.totalQuestions,
        submittedAt: s.submittedAt,
        wasTerminated: s.wasTerminated,
        timeRemaining: s.timeRemaining,
        tabSwitchCount: s.tabSwitchCount,
        terminationReason: s.terminationReason,
        cheatingDetected: s.cheatingDetected,
        teacherId: s.teacherId,
      }));
    },
    deleteByTeacherId: async (teacherId: string): Promise<void> => {
      await connectDB();
      await Submission.deleteMany({ teacherId });
    },
  },
  clearTeacherData: async (teacherId: string): Promise<void> => {
    await db.students.deleteByTeacherId(teacherId);
    await db.exams.deleteByTeacherId(teacherId);
    await db.submissions.deleteByTeacherId(teacherId);
  },
};
