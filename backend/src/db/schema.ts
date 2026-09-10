import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// Users table (Student, Advisor, Chair, Admin)
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(), // Student or Employee Code
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role', { enum: ['student', 'advisor', 'qa_chair', 'admin'] }).notNull(),
  department: text('department'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

// Advising Records table
export const advisingRecords = sqliteTable('advising_records', {
  id: text('id').primaryKey(),
  studentId: text('student_id').notNull().references(() => users.id),
  advisorId: text('advisor_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  category: text('category', { enum: ['academic', 'personal', 'career', 'leave_dropout', 'other'] }).notNull(),
  summary: text('summary').notNull(),
  status: text('status', { enum: ['open', 'in_progress', 'resolved', 'closed'] }).notNull().default('open'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// Meetings table
export const meetings = sqliteTable('meetings', {
  id: text('id').primaryKey(),
  recordId: text('record_id').references(() => advisingRecords.id),
  studentId: text('student_id').notNull().references(() => users.id),
  advisorId: text('advisor_id').notNull().references(() => users.id),
  scheduledAt: integer('scheduled_at', { mode: 'timestamp' }).notNull(),
  location: text('location'),
  notes: text('notes'),
  status: text('status', { enum: ['scheduled', 'completed', 'cancelled'] }).notNull().default('scheduled'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

// Student Voice Responses table (Voluntary Exit / Leave Survey)
export const studentVoiceResponses = sqliteTable('student_voice_responses', {
  id: text('id').primaryKey(),
  exitCaseId: text('exit_case_id'),
  studentId: text('student_id').references(() => users.id),
  isAnonymous: integer('is_anonymous', { mode: 'boolean' }).notNull().default(false),
  exitType: text('exit_type', { enum: ['withdrawal', 'leave_of_absence', 'transfer', 'dropout'] }).notNull(),
  academicYear: text('academic_year').notNull(),
  primaryFactors: text('primary_factors').notNull(), // JSON string array
  curriculumRating: integer('curriculum_rating').notNull(),
  teachingRating: integer('teaching_rating').notNull(),
  advisorRating: integer('advisor_rating').notNull(),
  servicesRating: integer('services_rating').notNull(),
  overallRating: integer('overall_rating').notNull(),
  whatCouldUniversityDoBetter: text('what_could_university_do_better'),
  curriculumImprovementSuggestions: text('curriculum_improvement_suggestions'),
  adviceForFutureStudents: text('advice_for_future_students'),
  shareWithAdvisor: integer('share_with_advisor', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

