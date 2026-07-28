/**
 * Pruebas para `AddToCartSection`.
 * Qué prueba: verifica que el componente renderice productos obtenidos desde la API
 * y que el botón "Agregar al carrito" invoque la llamada a la API de carrito.
 */
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddToCartSection from './AddToCartSection'
import { productAPI, cartAPI } from '@/lib/api'

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}))

describe('AddToCartSection', () => {
  afterEach(() => vi.restoreAllMocks())

  // Caso: muestra productos desde productAPI y al pulsar el botón llama a cartAPI.create
  it('renderiza y permite agregar al carrito', async () => {
    vi.spyOn(productAPI, 'getAll').mockResolvedValueOnce([
      { id: 'p1', name: 'Producto 1', price: 20 },
    ] as any)
    vi.spyOn(cartAPI, 'create').mockResolvedValueOnce({ ok: true } as any)

    render(<AddToCartSection />)

    await waitFor(() => expect(screen.getByText(/Producto 1/)).toBeDefined())

    const btn = screen.getByText('Agregar al carrito')
    expect(btn).toBeDefined()

    await userEvent.click(btn)

    expect(cartAPI.create).toHaveBeenCalled()
  })
})
