import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App component', () => {
  it('renders application heading', () => {
    render(<App />)
    const headings = screen.getAllByText(/AdvisingLog/i)
    expect(headings.length).toBeGreaterThan(0)
  })
})
