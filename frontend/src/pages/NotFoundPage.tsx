import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { Compass, Home, LogIn } from 'lucide-react'

export default function NotFoundPage() {
  const { t } = useLanguage()
  const { currentUser, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  function handleGoHome() {
    if (!isAuthenticated || !currentUser) {
      navigate('/login')
      return
    }
    switch (currentUser.role) {
      case 'student':
        navigate('/student')
        break
      case 'advisor':
        navigate('/advisor')
        break
      case 'qa_chair':
        navigate('/qa')
        break
      case 'admin':
        navigate('/admin')
        break
      default:
        navigate('/')
    }
  }

  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-6 text-center">
      <div className="h-16 w-16 rounded-3xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-200/80 dark:border-sky-800 flex items-center justify-center mb-5 shadow-sm ring-4 ring-sky-500/10">
        <Compass className="h-8 w-8" />
      </div>

      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 mb-3">
        HTTP 404 · Page Not Found
      </span>

      <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 mb-2">
        {t('ไม่พบหน้าที่คุณต้องการ', 'Page Not Found')}
      </h1>

      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed mb-6">
        {t(
          'ลิงก์ที่คุณกดอาจไม่ถูกต้อง มีการเปลี่ยนแปลงที่อยู่ หรือคุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้',
          'The link you clicked might be broken, the page was moved, or you may lack permissions to view it.'
        )}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleGoHome}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
        >
          <Home className="h-4 w-4" />
          {t('กลับสู่หน้าหลัก', 'Back to Dashboard')}
        </button>

        {!isAuthenticated && (
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs"
          >
            <LogIn className="h-4 w-4" />
            {t('เข้าสู่ระบบ', 'Sign In')}
          </button>
        )}
      </div>
    </div>
  )
}

