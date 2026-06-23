import '@testing-library/jest-dom'
import React from 'react'
import { vi } from 'vitest'

// Provide a global fetch mock so components using `fetch` don't perform real network calls
globalThis.fetch = vi.fn().mockImplementation(() =>
	Promise.resolve({ ok: true, json: async () => [] }) as any
)

// Mock react-router-dom primitives used in layout and routes
vi.mock('react-router-dom', () => ({
	Link: ({ children, to, ...props }: any) => React.createElement('a', { href: to, ...props }, children),
	useLocation: () => ({ pathname: '/' }),
	Navigate: ({ to }: any) => React.createElement('div', { 'data-navigate-to': to }),
}))

// Mock lucide icons
vi.mock('lucide-react', () => ({
	ShoppingCart: (props: any) => React.createElement('svg', props),
	User: (props: any) => React.createElement('svg', props),
}))

// Mock basic UI primitives used across components
vi.mock('@/components/ui/card', () => ({
	Card: ({ children }: any) => React.createElement('div', { 'data-testid': 'card' }, children),
	CardHeader: ({ children }: any) => React.createElement('div', {}, children),
	CardTitle: ({ children }: any) => React.createElement('div', {}, children),
	CardContent: ({ children }: any) => React.createElement('div', {}, children),
}))

vi.mock('@/components/ui/button', () => ({
	Button: ({ children, ...props }: any) => React.createElement('button', props, children),
}))

vi.mock('@/components/ui/separator', () => ({ Separator: () => React.createElement('hr', {}) }))

// Provide a minimal toast mock
vi.mock('@/components/ui/toast', () => ({
	Toast: ({ children }: any) => React.createElement('div', {}, children),
}))
