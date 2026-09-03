// ============================================================
// Student — Request Advising Form
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useToast } from '@/contexts/ToastContext'
import { PageHeader, Button, Card } from '@/components/ui'
import { ADVISING_CATEGORIES } from '@/types'
import type { AdvisingCategory } from '@/types'

export default function RequestAdvising() {
  const { currentUser } = useAuth()
  const store = useStore()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [category, setCategory] = useState<AdvisingCategory | ''>('')
  const [subCategory, setSubCategory] = useState('')
  const [details, setDetails] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [preferredTime, setPreferredTime] = useState('')
  const [attachments, setAttachments] = useState<string[]>([])
  const [pdpaConsent, setPdpaConsent] = useState(false)

  if (!currentUser) return null

  const rosterEntry = store.roster.find(r => r.studentId === currentUser!.id && r.isActive)
  const advisor = rosterEntry ? store.users.find(u => u.id === rosterEntry.advisorId) : null

  const selectedCategoryConfig = store.categoryConfigs.find(c => c.value === category)
  const subCategories = selectedCategoryConfig?.subCategories || []

  function handleFileSimulate() {
    const fakeFiles = ['document.pdf', 'transcript.pdf', 'form.pdf', 'screenshot.png']
    const random = fakeFiles[Math.floor(Math.random() * fakeFiles.length)]
    setAttachments(prev => [...prev, random])
    addToast('info', 'File attached', `${random} added (simulated)`)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!category || !details || !preferredDate || !preferredTime || !pdpaConsent) {
      addToast('error', 'Validation Error', 'Please fill in all required fields and give consent.')
      return
    }

    if (!advisor) {
      addToast('error', 'No Advisor', 'You do not have an assigned advisor. Please contact admin.')
      return
    }

    const newRequest = store.addRequest({
      studentId: currentUser!.id,
      advisorId: advisor.id,
      category: category as AdvisingCategory,
      subCategory: subCategory || undefined,
      details,
      preferredDate,
      preferredTime,
      attachments,
      pdpaConsent,
      status: 'requested',
    })

    // Notify advisor
    store.addNotification({
      userId: advisor.id,
      type: 'action_required',
      title: 'New Advising Request',
      message: `${currentUser!.name} (${currentUser!.code}) submitted a request: ${ADVISING_CATEGORIES.find(c => c.value === category)?.label}`,
      relatedId: newRequest.id,
      isRead: false,
    })

    // Audit log
    store.addAuditLog({
      userId: currentUser!.id,
      userName: currentUser!.name,
      userRole: currentUser!.role,
      action: 'request_created',
      description: `Created advising request for ${ADVISING_CATEGORIES.find(c => c.value === category)?.label}`,
      targetId: newRequest.id,
    })

    addToast('success', 'Request Submitted', 'Your advising request has been sent to your advisor.')
    navigate('/student/history')
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Request Advising"
        description="Submit a new advising request to your assigned advisor."
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Advisor info */}
          {advisor && (
            <div className="p-3 bg-slate-50 rounded-md">
              <p className="text-xs text-slate-500">Your request will be sent to:</p>
              <p className="text-sm font-medium text-slate-900">{advisor.name}</p>
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Advising Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={e => { setCategory(e.target.value as AdvisingCategory); setSubCategory('') }}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a category</option>
              {ADVISING_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Sub-category */}
          {subCategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sub-category</label>
              <select
                value={subCategory}
                onChange={e => setSubCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select (optional)</option>
                {subCategories.map(sc => (
                  <option key={sc} value={sc}>{sc}</option>
                ))}
              </select>
            </div>
          )}

          {/* Details */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Problem / Details <span className="text-red-500">*</span>
            </label>
            <textarea
              value={details}
              onChange={e => setDetails(e.target.value)}
              rows={4}
              placeholder="Describe your issue or question..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Preferred Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={e => setPreferredDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Preferred Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={preferredTime}
                onChange={e => setPreferredTime(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Attachments</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {attachments.map((f, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">
                  {f}
                  <button type="button" onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-slate-600">&times;</button>
                </span>
              ))}
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={handleFileSimulate}>
              Attach File (Simulated)
            </Button>
          </div>

          {/* PDPA Consent */}
          <div className="p-3 bg-slate-50 rounded-md">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={pdpaConsent}
                onChange={e => setPdpaConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-600">
                <span className="font-medium text-slate-900">PDPA / Privacy Consent</span> <span className="text-red-500">*</span>
                <br />
                I consent to the collection and processing of my personal data for advising purposes in accordance with university privacy policy.
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" onClick={() => navigate('/student')}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Request</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
