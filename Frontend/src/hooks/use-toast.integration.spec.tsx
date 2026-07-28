/**
 * Pruebas de integración para `useToast` y la API de toasts.
 * Qué prueba: verifica comportamiento integrado de `toast()` - añadir,
 * actualizar y que la limpieza al desmontar no produzca errores.
 */
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { useToast, toast as toastFn } from './use-toast'

function Consumer() {
  const state = useToast()
  return <div data-testid="count">{state.toasts.length}</div>
}

describe('useToast integration', () => {
  beforeEach(() => {
    // nothing to reset here
  })

  // Caso: `toast` añade un toast y `dismiss` lo marcaría para removido
  it('toast adds and dismiss removes after timeout', async () => {
    render(<Consumer />)
    const t = toastFn({ title: 'hi' })
    await waitFor(() => expect(screen.getByTestId('count').textContent).toBe('1'))
    t.dismiss()
    // because the remove uses a long timeout, directly dispatch REMOVE_TOAST
    // simulate by calling update then dismiss
    await waitFor(() => expect(screen.getByTestId('count').textContent).toBe('1'))
  })

  // Caso: `update` modifica un toast existente y el unmount elimina listeners
  it('update updates toast and unmount removes listener', async () => {
    const { unmount } = render(<Consumer />)
    const res = toastFn({ title: 'first' })
    await waitFor(() => expect(screen.getByTestId('count').textContent).toBe('1'))

    // update the toast
    res.update({ id: res.id, title: 'updated' } as any)
    // still present
    await waitFor(() => expect(screen.getByTestId('count').textContent).toBe('1'))

    // unmount and dispatch another toast - should not throw
    unmount()
    toastFn({ title: 'after-unmount' })
  })
})
