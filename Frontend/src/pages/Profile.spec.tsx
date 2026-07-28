/**
 * Pruebas para la página `Profile`.
 * Qué prueba: cada caso valida la carga del usuario en el formulario,
 * la edición de campos, el comportamiento al enviar (éxito/error) y el
 * estado cuando no hay usuario en sesión.
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Profile from './Profile'

vi.mock('@/hooks/use-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }))

describe('Profile page', () => {
  beforeEach(() => sessionStorage.clear())

  // Caso: carga usuario actual en el formulario y al enviar llama a customerAPI.update
  it('loads current user into form and submits update', async () => {
    const user = { _id: 'u1', firstName: 'Juan', email: 'a@b.com' }
    sessionStorage.setItem('user', JSON.stringify(user))
    const apiModule = await import('@/lib/api')
    const updateSpy = vi.spyOn(apiModule.customerAPI, 'update').mockResolvedValue({})

    render(<Profile />)

    await waitFor(() => expect(screen.getByDisplayValue('Juan')).toBeDefined())

    const form = screen.queryByRole('form') || screen.getByText('Guardar cambios').closest('form')
    fireEvent.submit(form!)

    await waitFor(() => expect(updateSpy).toHaveBeenCalled())
  })

  // Caso: render mínimo del componente Profile sin errores
  it('renderiza el componente Profile (minimo)', () => {
    render(<Profile />)
    expect(document.body).toBeDefined()
  })

  // Caso: si customerAPI.update falla, se muestra un toast de error
  it('shows error toast when update fails', async () => {
    const user = { _id: 'u1', firstName: 'Juan', email: 'a@b.com' }
    sessionStorage.setItem('user', JSON.stringify(user))
    const apiModule = await import('@/lib/api')
    vi.spyOn(apiModule.customerAPI, 'update').mockRejectedValue(new Error('fail'))
    const toastMock = vi.fn()
    const hooks = await import('@/hooks/use-toast')
    vi.spyOn(hooks, 'useToast').mockReturnValue({ toast: toastMock } as any)

    render(<Profile />)

    const form = screen.queryByRole('form') || screen.getByText('Guardar cambios').closest('form')
    fireEvent.submit(form!)

    await waitFor(() => expect(toastMock).toHaveBeenCalled())
  })

  // Caso: permite editar campos del formulario y reflejar el nuevo valor
  it('allows editing fields', async () => {
    const user = { _id: 'u1', firstName: 'Juan', email: 'a@b.com' }
    sessionStorage.setItem('user', JSON.stringify(user))
    render(<Profile />)

    await waitFor(() => expect(screen.getByDisplayValue('Juan')).toBeDefined())
    const first = screen.getByLabelText('Nombre') as HTMLInputElement
    fireEvent.change(first, { target: { value: 'Pedro' } })
    expect((screen.getByLabelText('Nombre') as HTMLInputElement).value).toBe('Pedro')
  })

  // Caso: si no hay usuario en sessionStorage, los inputs están vacíos
  it('renders empty when no user in session', async () => {
    sessionStorage.clear()
    render(<Profile />)
    // inputs should exist but be empty
    await waitFor(() => expect(screen.getByLabelText('Nombre')).toBeDefined())
    expect((screen.getByLabelText('Nombre') as HTMLInputElement).value).toBe('')
  })

  // Caso: al enviar con éxito, se invoca el toast de confirmación
  it('successful submit shows toast', async () => {
    const user = { _id: 'u1', firstName: 'Ana', email: 'a@b.com' }
    sessionStorage.setItem('user', JSON.stringify(user))
    const apiModule = await import('@/lib/api')
    vi.spyOn(apiModule.customerAPI, 'update').mockResolvedValue({})
    const toastMock = vi.fn()
    const hooks = await import('@/hooks/use-toast')
    vi.spyOn(hooks, 'useToast').mockReturnValue({ toast: toastMock } as any)

    render(<Profile />)
    const form = screen.queryByRole('form') || screen.getByText('Guardar cambios').closest('form')
    fireEvent.submit(form!)

    await waitFor(() => expect(toastMock).toHaveBeenCalled())
  })
})

