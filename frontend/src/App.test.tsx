import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import App from './App'
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageProvider } from '@/contexts/LanguageContext'

function ThemeTestConsumer() {
  const { theme, setTheme, isDark, toggleTheme } = useTheme()
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <span data-testid="is-dark">{isDark ? 'dark' : 'light'}</span>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('system')}>Set System</button>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  )
}

describe('App component', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('renders application heading', () => {
    render(<App />)
    const heading = screen.getByRole('heading', { name: /AdvisingLog/i })
    expect(heading).toBeInTheDocument()
  })

  it('provides ThemeContext and switches themes correctly', () => {
    render(
      <ThemeProvider>
        <ThemeTestConsumer />
      </ThemeProvider>
    )

    // Initially defaults to system
    expect(screen.getByTestId('current-theme').textContent).toBe('system')

    // Set to dark
    act(() => {
      fireEvent.click(screen.getByText('Set Dark'))
    })
    expect(screen.getByTestId('current-theme').textContent).toBe('dark')
    expect(screen.getByTestId('is-dark').textContent).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('advising_log_theme')).toBe('dark')

    // Set to light
    act(() => {
      fireEvent.click(screen.getByText('Set Light'))
    })
    expect(screen.getByTestId('current-theme').textContent).toBe('light')
    expect(screen.getByTestId('is-dark').textContent).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('advising_log_theme')).toBe('light')

    // Toggle theme from light to dark
    act(() => {
      fireEvent.click(screen.getByText('Toggle Theme'))
    })
    expect(screen.getByTestId('current-theme').textContent).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('renders ThemeToggle and instantly toggles theme on click', () => {
    render(
      <ThemeProvider>
        <LanguageProvider>
          <ThemeToggle />
        </LanguageProvider>
      </ThemeProvider>
    )

    const toggleButton = screen.getByRole('button', { name: /เปลี่ยนเป็นโหมด|Switch to/i })
    expect(toggleButton).toBeInTheDocument()

    // Clicking toggles theme instantly
    act(() => {
      fireEvent.click(toggleButton)
    })
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // Clicking again toggles back to light
    act(() => {
      fireEvent.click(toggleButton)
    })
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})


