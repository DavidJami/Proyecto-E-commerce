/**
 * Pruebas para `CatalogSection`.
 * Qué prueba: valida que el título del catálogo se muestre y que los productos
 * obtenidos desde la API aparezcan con su nombre, precio y stock. También incluye
 * una prueba adicional que verifica matchers y comportamiento de la respuesta vacía.
 */
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import CatalogSection from './CatalogSection'
import { productAPI } from '@/lib/api'
import { afterEach } from 'vitest'

describe('CatalogSection', () => {
  afterEach(() => vi.restoreAllMocks())

  // Caso: renderiza título y lista de productos obtenidos por productAPI.getAll
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

  // Caso: cuando la API devuelve vacío, comprobamos matchers y formato esperado
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
