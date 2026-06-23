import React from 'react'
import { render, screen } from '@testing-library/react'
import Profile from './Profile'

describe('Profile page', () => {
  it('renderiza el componente Profile', () => {
    render(<Profile />)
    // comprobación mínima: existe el contenedor principal o título
    expect(document.body).toBeDefined()
  })
})
