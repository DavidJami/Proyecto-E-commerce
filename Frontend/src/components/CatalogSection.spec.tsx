import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import CatalogSection from './CatalogSection'
import { productAPI } from '@/lib/api'

describe('CatalogSection', () => {
  afterEach(() => vi.restoreAllMocks())

  it('muestra el título y productos desde la API', async () => {
    vi.spyOn(productAPI, 'getAll').mockResolvedValueOnce([
      { id: 'p1', name: 'Producto 1', price: 10, stock: 5 },
    ] as any)

    render(<CatalogSection />)

    expect(screen.getByText('Catálogo de Productos')).toBeDefined()

    await waitFor(() => {
      expect(screen.getByText(/Producto 1/)).toBeDefined()
      expect(screen.getByText(/Precio: \$10/)).toBeDefined()
      expect(screen.getByText(/Stock: 5/)).toBeDefined()
    })
  })

  it('usa matchers de Jasmine-like', async () => {
    vi.spyOn(productAPI, 'getAll').mockResolvedValueOnce([] as any)

    render(<CatalogSection />)

    const empty = await productAPI.getAll()
    expect(empty).toEqual([])
    expect(empty).toBeDefined()
    expect(empty).toBeInstanceOf(Array)
    expect(JSON.stringify(empty)).toMatch(/\[\]/)
  })
})
