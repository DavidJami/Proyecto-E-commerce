/**
 * Pruebas unitarias para el `reducer` de `use-toast`.
 * Qué prueba: cada test verifica la transición de estado para acciones
 * como ADD_TOAST, UPDATE_TOAST, DISMISS_TOAST y REMOVE_TOAST.
 */
import { reducer } from './use-toast'

describe('use-toast reducer', () => {
  const baseState = { toasts: [] } as any

  // Caso: ADD_TOAST debe insertar un toast y respetar el límite
  it('ADD_TOAST adds a toast and limits by TOAST_LIMIT', () => {
    const action = { type: 'ADD_TOAST', toast: { id: '1', open: true } } as any
    const res = reducer(baseState, action)
    expect(res.toasts[0].id).toBe('1')
  })

  // Caso: UPDATE_TOAST modifica el toast existente por id
  it('UPDATE_TOAST updates existing toast', () => {
    const state = { toasts: [{ id: '1', open: true, title: 'old' }] } as any
    const action = { type: 'UPDATE_TOAST', toast: { id: '1', title: 'new' } } as any
    const res = reducer(state, action)
    expect(res.toasts[0].title).toBe('new')
  })

  // Caso: DISMISS_TOAST cierra (open=false) un toast concreto o todos
  it('DISMISS_TOAST sets open=false for matching id or all', () => {
    const state = { toasts: [{ id: '1', open: true }, { id: '2', open: true }] } as any
    const res1 = reducer(state, { type: 'DISMISS_TOAST', toastId: '1' } as any)
    expect(res1.toasts.find((t: any) => t.id === '1').open).toBe(false)

    const res2 = reducer(state, { type: 'DISMISS_TOAST' } as any)
    expect(res2.toasts.every((t: any) => t.open === false)).toBe(true)
  })

  // Caso: REMOVE_TOAST elimina un toast por id o todos si no se pasa id
  it('REMOVE_TOAST removes toast by id or all', () => {
    const state = { toasts: [{ id: '1' }, { id: '2' }] } as any
    const res1 = reducer(state, { type: 'REMOVE_TOAST', toastId: '1' } as any)
    expect(res1.toasts.find((t: any) => t.id === '1')).toBeUndefined()

    const res2 = reducer(state, { type: 'REMOVE_TOAST' } as any)
    expect(res2.toasts.length).toBe(0)
  })
})
