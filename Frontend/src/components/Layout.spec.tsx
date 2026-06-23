import React from 'react'
import { render, screen } from '@testing-library/react'
import { Layout } from './Layout'

describe('Layout', () => {
  it('renderiza children y contiene el logo o marca', () => {
    render(
      <Layout>
        <div>Niño</div>
      </Layout>
    )
    expect(screen.getByText('Niño')).toBeDefined()
  })
})
