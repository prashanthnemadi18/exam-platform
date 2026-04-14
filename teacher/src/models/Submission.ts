import mongoose, { Schema, Model } from 'mongoose';

export interface ISubmission {
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

const SubmissionSchema = new Schema<ISubmission>({
  id: { type: String, required: true, unique: true },
  examId: { type: String, required: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentUSN: { type: String, required: true },
  studentEmail: { type: String, required: true },
  answers: [Schema.Types.Mixed],
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  submittedAt: { type: String, required: true },
  wasTerminated: { type: Boolean },
  timeRemaining: { type: Number },
  tabSwitchCount: { type: Number },
  terminationReason: { type: String },
  cheatingDetected: { type: Boolean },
  teacherId: { type: String },
}, {
  timestamps: true,
});

SubmissionSchema.index({ teacherId: 1 });
SubmissionSchema.index({ examId: 1 });
SubmissionSchema.index({ id: 1 });

export const Submission: Model<ISubmission> = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);
