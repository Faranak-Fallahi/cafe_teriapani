import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminLoginModal } from './AdminLoginModal.jsx'
import { AppDataContext } from '../context/appDataContext.js'

const signInMock = vi.fn()

function renderLogin() {
  return render(
    <AppDataContext.Provider value={{ signIn: signInMock, adminLoading: false }}>
      <AdminLoginModal onClose={vi.fn()} onSuccess={vi.fn()} />
    </AppDataContext.Provider>,
  )
}

describe('AdminLoginModal', () => {
  beforeEach(() => signInMock.mockReset())

  it('requires an email and password, and validates email format', () => {
    renderLogin()
    const email = screen.getByPlaceholderText('admin@example.com')
    const password = screen.getByLabelText('رمز عبور')

    expect(email).toBeRequired()
    expect(email).toHaveAttribute('type', 'email')
    expect(password).toBeRequired()
    fireEvent.change(email, { target: { value: 'invalid-email' } })
    expect(email).not.toBeValid()
    expect(signInMock).not.toHaveBeenCalled()
  })

  it('submits valid credentials through the app context', async () => {
    signInMock.mockResolvedValue(undefined)
    renderLogin()
    fireEvent.change(screen.getByPlaceholderText('admin@example.com'), { target: { value: 'admin@example.com' } })
    fireEvent.change(screen.getByLabelText('رمز عبور'), { target: { value: 'wrong-password' } })
    fireEvent.click(screen.getByRole('button', { name: 'ورود به پنل' }))

    expect(signInMock).toHaveBeenCalledWith('admin@example.com', 'wrong-password')
  })
})
