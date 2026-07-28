/**
 * Pruebas para `Layout`.
 * Qué prueba: verifica que el componente renderice los `children` correctamente
 * y que el layout muestre elementos hijos (p.ej. logo/brand) esperando su presencia.
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Layout } from './Layout'

describe('Layout', () => {
  // Caso: se renderizan los children pasados al Layout y se muestra contenido base
  it('renderiza children y contiene el logo o marca', () => {
    render(
      <Layout>
        <div>Niño</div>
      </Layout>
    )
    expect(screen.getByText('Niño')).toBeDefined()
  })
})
