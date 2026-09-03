import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App component', () => {
  it('renders application heading', () => {
    render(<App />)
    const headings = screen.getAllByText(/AdvisingLog/i)
    expect(headings.length).toBeGreaterThan(0)
  })

  it('opens the login page from the top bar', () => {
    window.history.pushState({}, '', '/')
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    expect(window.location.pathname).toBe('/login')
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('routes prototype users to their role dashboard', () => {
    window.history.pushState({}, '', '/login')
    render(<App />)

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'qa-coordinator' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'prototype' } })
    fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    expect(window.location.pathname).toBe('/dashboard/qa')
    expect(screen.getByText('Program overview')).toBeInTheDocument()
    expect(screen.getByText('AUN-QA evidence')).toBeInTheDocument()
  })

  it('collapses the dashboard sidebar from the menu button', () => {
    window.history.pushState({}, '', '/dashboard/student')
    render(<App />)

    const collapseButton = screen.getByRole('button', { name: 'Collapse sidebar' })
    fireEvent.click(collapseButton)

    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBeInTheDocument()
  })

  it('opens the student consultation dropdown', () => {
    window.history.pushState({}, '', '/dashboard/student')
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Consultation' }))

    expect(screen.getByRole('button', { name: 'Create Request' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Appointments' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'History' })).toBeInTheDocument()
  })

  it('places Dashboard before Consultation in the student navigation', () => {
    window.history.pushState({}, '', '/dashboard/student')
    render(<App />)

    const navigationButtons = screen.getByRole('navigation').querySelectorAll('button')

    const dashboardIndex = Array.from(navigationButtons).findIndex((button) => button.textContent?.includes('Dashboard'))
    const consultationIndex = Array.from(navigationButtons).findIndex((button) => button.textContent?.includes('Consultation'))

    expect(dashboardIndex).toBe(0)
    expect(dashboardIndex).toBeLessThan(consultationIndex)
  })

  it('opens profile, feedback, and sign out from the user menu', () => {
    window.history.pushState({}, '', '/dashboard/advisor')
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Open user menu' }))

    expect(screen.getByRole('button', { name: 'Profile' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Feedback' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument()
    expect(screen.queryByRole('navigation')?.textContent).not.toContain('Profile')
  })

  it('keeps profile and feedback out of the student sidebar', () => {
    window.history.pushState({}, '', '/dashboard/student')
    render(<App />)

    expect(screen.getByRole('navigation')).not.toHaveTextContent('Profile')
    expect(screen.getByRole('navigation')).not.toHaveTextContent('Feedback')
  })
})
