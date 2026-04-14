import mongoose, { Schema, Model } from 'mongoose';

export interface IExam {
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

const ExamSchema = new Schema<IExam>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, required: true },
  questionType: { type: String, required: true },
  numberOfQuestions: { type: Number, required: true },
  duration: { type: Number, required: true },
  questions: [Schema.Types.Mixed],
  createdAt: { type: String, required: true },
  createdBy: { type: String, required: true },
  teacherId: { type: String },
}, {
  timestamps: true,
});

ExamSchema.index({ teacherId: 1 });
ExamSchema.index({ id: 1 });

export const Exam: Model<IExam> = mongoose.models.Exam || mongoose.model<IExam>('Exam', ExamSchema);
