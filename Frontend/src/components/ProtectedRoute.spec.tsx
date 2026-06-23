import React from 'react'
import { render, screen } from '@testing-library/react'
import { ProtectedRoute } from './ProtectedRoute'

describe('ProtectedRoute', () => {
  it('muestra children cuando hay acceso', () => {
    // Simular usuario autenticado en sessionStorage
    sessionStorage.setItem('user', JSON.stringify({ role: 'admin' }))
    render(
      <ProtectedRoute>
        <div>Contenido protegido</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Contenido protegido')).toBeDefined()
    sessionStorage.removeItem('user')
  })
})
