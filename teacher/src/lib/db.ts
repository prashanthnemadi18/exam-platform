// Real database using MongoDB
import { MongoClient } from 'mongodb';

const uri = process.env.STORAGE_URL || process.env.MONGODB_URI || '';
let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

// If no MongoDB URI, use in-memory fallback for build
const hasMongoDb = !!uri;

if (hasMongoDb) {
  if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

async function getDatabase() {
  if (!hasMongoDb || !clientPromise) {
    throw new Error('MongoDB not configured');
  }
  const client = await clientPromise;
  return client.db('exam-platform');
}

// In-memory fallback for when MongoDB is not configured
let inMemoryStudents: Student[] = [];
let inMemoryExams: Exam[] = [];
let inMemorySubmissions: Submission[] = [];

interface Student {
  id: string;
  name: string;
  usn: string;
  semester: string;
  email: string;
  registeredAt: string;
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
}

export const db = {
  students: {
    getAll: async (): Promise<Student[]> => {
      try {
        if (!hasMongoDb) {
          return inMemoryStudents;
        }
        const database = await getDatabase();
        const collection = database.collection<Student>('students');
        const students = await collection.find({}).sort({ registeredAt: -1 }).toArray();
        return students;
      } catch (error) {
        console.error('Error getting students:', error);
        return inMemoryStudents;
      }
    },
    add: async (student: Student): Promise<Student> => {
      try {
        if (!hasMongoDb) {
          inMemoryStudents.push(student);
          return student;
        }
        const database = await getDatabase();
        const collection = database.collection<Student>('students');
        await collection.insertOne(student as any);
        return student;
      } catch (error) {
        console.error('Error adding student:', error);
        inMemoryStudents.push(student);
        return student;
      }
    },
    findById: async (id: string): Promise<Student | null> => {
      try {
        if (!hasMongoDb) {
          return inMemoryStudents.find(s => s.id === id) || null;
        }
        const database = await getDatabase();
        const collection = database.collection<Student>('students');
        const student = await collection.findOne({ id });
        return student;
      } catch (error) {
        console.error('Error finding student:', error);
        return inMemoryStudents.find(s => s.id === id) || null;
      }
    },
  },
  exams: {
    getAll: async (): Promise<Exam[]> => {
      try {
        if (!hasMongoDb) {
          return inMemoryExams;
        }
        const database = await getDatabase();
        const collection = database.collection<Exam>('exams');
        const exams = await collection.find({}).sort({ createdAt: -1 }).toArray();
        return exams;
      } catch (error) {
        console.error('Error getting exams:', error);
        return inMemoryExams;
      }
    },
    add: async (exam: Exam): Promise<Exam> => {
      try {
        if (!hasMongoDb) {
          inMemoryExams.push(exam);
          return exam;
        }
        const database = await getDatabase();
        const collection = database.collection<Exam>('exams');
        await collection.insertOne(exam as any);
        return exam;
      } catch (error) {
        console.error('Error adding exam:', error);
        inMemoryExams.push(exam);
        return exam;
      }
    },
    findById: async (id: string): Promise<Exam | null> => {
      try {
        if (!hasMongoDb) {
          return inMemoryExams.find(e => e.id === id) || null;
        }
        const database = await getDatabase();
        const collection = database.collection<Exam>('exams');
        const exam = await collection.findOne({ id });
        return exam;
      } catch (error) {
        console.error('Error finding exam:', error);
        return inMemoryExams.find(e => e.id === id) || null;
      }
    },
  },
  submissions: {
    getAll: async (): Promise<Submission[]> => {
      try {
        if (!hasMongoDb) {
          return inMemorySubmissions;
        }
        const database = await getDatabase();
        const collection = database.collection<Submission>('submissions');
        const submissions = await collection.find({}).sort({ submittedAt: -1 }).toArray();
        return submissions;
      } catch (error) {
        console.error('Error getting submissions:', error);
        return inMemorySubmissions;
      }
    },
    add: async (submission: Submission): Promise<Submission> => {
      try {
        if (!hasMongoDb) {
          inMemorySubmissions.push(submission);
          return submission;
        }
        const database = await getDatabase();
        const collection = database.collection<Submission>('submissions');
        await collection.insertOne(submission as any);
        return submission;
      } catch (error) {
        console.error('Error adding submission:', error);
        inMemorySubmissions.push(submission);
        return submission;
      }
    },
    findByExamId: async (examId: string): Promise<Submission[]> => {
      try {
        if (!hasMongoDb) {
          return inMemorySubmissions.filter(s => s.examId === examId);
        }
        const database = await getDatabase();
        const collection = database.collection<Submission>('submissions');
        const submissions = await collection.find({ examId }).sort({ submittedAt: -1 }).toArray();
        return submissions;
      } catch (error) {
        console.error('Error finding submissions:', error);
        return inMemorySubmissions.filter(s => s.examId === examId);
      }
    },
  },
};
