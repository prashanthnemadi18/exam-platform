// Database layer - Now using Supabase
import { supabaseDb } from './supabase-db';

// Export types from supabase-db
export type { IStudent, IExam, ISubmission } from './supabase-db';

// Use Supabase database
export const db = supabaseDb;
