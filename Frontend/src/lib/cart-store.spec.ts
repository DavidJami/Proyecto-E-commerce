/**
 * Pruebas para `cartStore`.
 * Qué prueba: cada `it` valida operaciones básicas del store: añadir,
 * eliminar, actualizar cantidad y notificar suscriptores.
 */
import { cartStore } from './cart-store'

describe('cartStore', () => {
  afterEach(() => {
    cartStore.clear()
  })
  // Caso: añadir items con mismo id incrementa la cantidad y el total
  it('adds items and increases quantity if same id', () => {
    cartStore.addItem({ id: '1', productId: 'p1', name: 'A', price: 10, quantity: 1 })
    cartStore.addItem({ id: '1', productId: 'p1', name: 'A', price: 10, quantity: 2 })
    expect(cartStore.getCount()).toBe(3)
    expect(cartStore.getTotal()).toBe(30)
  })

  // Caso: eliminar item por id lo quita del store
  it('removes item', () => {
    cartStore.addItem({ id: '1', productId: 'p1', name: 'A', price: 10, quantity: 1 })
    cartStore.removeItem('1')
    expect(cartStore.getItems().length).toBe(0)
  })

  // Caso: actualizar la cantidad refleja el nuevo conteo total
  it('updates quantity', () => {
    cartStore.addItem({ id: '1', productId: 'p1', name: 'A', price: 10, quantity: 1 })
    cartStore.updateQuantity('1', 5)
    expect(cartStore.getCount()).toBe(5)
  })

  // Caso: clear vacía el store y notifica a los suscriptores
  it('clear notifies and empties', () => {
    let called = 0
    const unsub = cartStore.subscribe(() => called++)
    cartStore.addItem({ id: '1', productId: 'p1', name: 'A', price: 10, quantity: 1 })
    cartStore.clear()
    expect(cartStore.getItems().length).toBe(0)
    expect(called).toBeGreaterThanOrEqual(1)
    unsub()
  })
})
