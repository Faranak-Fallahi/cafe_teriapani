import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WelcomeScreen } from './WelcomeScreen.jsx'

describe('WelcomeScreen', () => {
  it('renders the cafe welcome content and menu entry action', () => {
    render(<WelcomeScreen onEnter={() => {}} prefersReducedMotion doodlesActive={false} siteSettings={{}} />)

    expect(screen.getByRole('heading', { name: 'تریاپانی' })).toBeInTheDocument()
    expect(screen.getByText('سلام! خیلی خوش اومدی به تریاپانی رفیق')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /مشاهده منوی خوشمزه/ })).toBeInTheDocument()
  })
})
