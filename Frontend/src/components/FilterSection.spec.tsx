import React from 'react'
import { render, screen } from '@testing-library/react'
import FilterSection from './FilterSection'

describe('FilterSection', () => {
  it('muestra el encabezado esperado', () => {
    render(<FilterSection />)
    expect(screen.getByText(/Filtrar/)).toBeDefined()
  })
})
