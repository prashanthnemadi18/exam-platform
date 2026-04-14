import mongoose, { Schema, Model } from 'mongoose';

export interface IStudent {
  id: string;
  name: string;
  usn: string;
  semester: string;
  email: string;
  registeredAt: string;
  teacherId?: string;
}

const StudentSchema = new Schema<IStudent>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  usn: { type: String, required: true },
  semester: { type: String, required: true },
  email: { type: String, required: true },
  registeredAt: { type: String, required: true },
  teacherId: { type: String },
}, {
  timestamps: true,
});

StudentSchema.index({ teacherId: 1 });
StudentSchema.index({ id: 1 });

export const Student: Model<IStudent> = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
