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
