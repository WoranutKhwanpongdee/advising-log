import { GraduationCap, Users, Calendar, FileText, BarChart3, ShieldCheck } from 'lucide-react'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">AdvisingLog</h1>
              <p className="text-xs text-slate-500 font-medium">Student Advising System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              System Online
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 text-white rounded-2xl p-8 shadow-lg mb-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-xs font-semibold rounded-full uppercase tracking-wider mb-3">
              Role-Based Advising Platform
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-2">
              Empowering Student Success & Advising Workflows
            </h2>
            <p className="text-indigo-100 text-base leading-relaxed">
              AdvisingLog streamlines meeting logs, advising records, QA reporting, follow-ups, and academic case tracking in one unified interface.
            </p>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">Student & Advisor Roles</h3>
            <p className="text-xs text-slate-500">Separated views and permissions tailored for Students, Advisors, Program Chairs, and Admins.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">Meeting & Records</h3>
            <p className="text-xs text-slate-500">Track scheduled appointments, log meeting notes, action items, and student progress over time.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">QA Reporting & Analytics</h3>
            <p className="text-xs text-slate-500">Generate AUN-QA compliance reports, analytical charts, and exportable Excel/CSV summaries.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">Privacy & Data Security</h3>
            <p className="text-xs text-slate-500">Strict ID-based access controls and encrypted database storage with Cloudflare D1.</p>
          </div>
        </div>

        {/* Tech Stack Status Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            Active Architecture & Tech Stack Setup
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Frontend</span>
              React + Vite + TypeScript
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Styling</span>
              Tailwind CSS + shadcn/ui
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Backend</span>
              Cloudflare Workers + Hono
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Database</span>
              Cloudflare D1 + Drizzle ORM
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
