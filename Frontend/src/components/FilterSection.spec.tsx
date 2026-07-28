/**
 * Pruebas para `FilterSection`.
 * Qué prueba: comprueba que se muestre el encabezado o texto de filtrado esperado.
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import FilterSection from './FilterSection'

describe('FilterSection', () => {
  // Caso: el componente muestra el texto o encabezado de filtrado previsto
  it('muestra el encabezado esperado', () => {
    render(<FilterSection />)
    expect(screen.getByText(/Filtrar/)).toBeDefined()
  })
})
