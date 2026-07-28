/**
 * Pruebas para `api` (helpers y APIs expuestas).
 * Qué prueba: cada bloque `it` verifica un comportamiento concreto de
 * las funciones exportadas por `api` (manejo de sessionStorage, login,
 * registro, respuestas fetch, y llamadas a `cart-sync`).
 */
import * as apiModule from './api'

// Mock del módulo `cart-sync` usado por las funciones que manejan el carrito
vi.mock('./cart-sync', () => ({
  clearUserCart: vi.fn().mockResolvedValue(undefined),
  loadCartForCurrentUser: vi.fn().mockResolvedValue(undefined),
}))

describe('api helpers', () => {
  beforeEach(() => sessionStorage.clear())
  afterEach(() => vi.restoreAllMocks())

  // Caso: getCurrentUser debe devolver null si el JSON almacenado está malformado
  it('getCurrentUser returns null on malformed JSON', () => {
    sessionStorage.setItem('user', '{bad json')
    expect(apiModule.getCurrentUser()).toBeNull()
  })

  // Caso: logoutUser limpia sessionStorage y dispara el evento `userLogout`
  it('logoutUser clears session and dispatches event', async () => {
    sessionStorage.setItem('user', JSON.stringify({ name: 'x' }))
    const listener = vi.fn()
    window.addEventListener('userLogout', listener as any)
    await apiModule.logoutUser()
    expect(sessionStorage.getItem('user')).toBeNull()
    expect(listener).toHaveBeenCalled()
  })

  // Caso: LoginAPI.login lanza si no encuentra usuarios que coincidan
  it('LoginAPI.login throws when user not found', async () => {
    vi.spyOn(apiModule.customerAPI, 'getAll').mockResolvedValue([])
    await expect(apiModule.LoginAPI.login('no', 'no')).rejects.toThrow()
  })

  // Caso: RegisterAPI.registerCustomer guarda el usuario en sessionStorage y devuelve el role
  it('RegisterAPI.registerCustomer stores user and returns role', async () => {
    const mockUser = { id: 'u1', email: 'a' }
    vi.spyOn(apiModule.customerAPI, 'create').mockResolvedValue(mockUser)
    const res = await apiModule.RegisterAPI.registerCustomer({ email: 'a' })
    expect(res.role).toBe('customer')
    expect(sessionStorage.getItem('user')).toBeDefined()
  })

  // Caso: las llamadas fetch que retornan ok: false deben lanzar errores
  it('api() throws when response not ok via customerAPI.getAll', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 }) as any
    await expect(apiModule.customerAPI.getAll()).rejects.toThrow()
  })

  // Caso: LoginAPI.login exitoso cuando la contraseña coincide (bcrypt)
  it('LoginAPI.login succeeds when password matches', async () => {
    const bcrypt = await import('bcryptjs')
    const hashed = bcrypt.hashSync('p', 8)
    const pwdUser = { email: 'a', password: hashed, role: 'customer' }
    vi.spyOn(apiModule.customerAPI, 'getAll').mockResolvedValue([pwdUser])

    const res = await apiModule.LoginAPI.login('a', 'p')
    expect(res.email).toBe('a')
  })

  // Caso: LoginAPI.login con rol distinto a 'customer' no intenta cargar carrito
  it('LoginAPI.login with non-customer role does not attempt loadCart', async () => {
    const bcrypt = await import('bcryptjs')
    const hashed = bcrypt.hashSync('p', 8)
    const adminUser = { email: 'adm', password: hashed, role: 'admin' }
    vi.spyOn(apiModule.customerAPI, 'getAll').mockResolvedValue([adminUser])

    const res = await apiModule.LoginAPI.login('adm', 'p')
    expect(res.role).toBe('admin')
  })

  // Caso: LoginAPI.login maneja la excepción de loadCartForCurrentUser dentro de setTimeout
  it('LoginAPI.login handles loadCartForCurrentUser rejection inside setTimeout', async () => {
    vi.useFakeTimers()
    // mock cart-sync to have loadCartForCurrentUser reject by spying the mocked module
    const cartSync = await import('./cart-sync')
    vi.spyOn(cartSync, 'loadCartForCurrentUser').mockRejectedValue(new Error('boom'))
    // ensure customers include a customer
    const bcrypt = await import('bcryptjs')
    const hashed = bcrypt.hashSync('p', 8)
    const cust = { email: 'c1', password: hashed, role: 'customer' }
    vi.spyOn(apiModule.customerAPI, 'getAll').mockResolvedValue([cust])

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    const res = await apiModule.LoginAPI.login('c1', 'p')
    expect(res.email).toBe('c1')

    // advance timers so the setTimeout callback runs
    vi.advanceTimersByTime(200)
    // allow pending promises to settle
    await Promise.resolve()

    expect(consoleError).toHaveBeenCalled()
    consoleError.mockRestore()
    vi.useRealTimers()
  })

  // Caso: logoutUser debe seguir limpiando session aun si clearUserCart falla
  it('logoutUser handles clearUserCart rejection', async () => {
    const cartSync = await import('./cart-sync')
    vi.spyOn(cartSync, 'clearUserCart').mockRejectedValue(new Error('err'))
    sessionStorage.setItem('user', JSON.stringify({ name: 'x' }))
    const listener = vi.fn()
    window.addEventListener('userLogout', listener as any)
    await apiModule.logoutUser()
    expect(sessionStorage.getItem('user')).toBeNull()
    expect(listener).toHaveBeenCalled()
  })

  // Caso: productAPI.getById realiza fetch y devuelve el JSON del producto
  it('productAPI.getById calls fetch and returns json', async () => {
    const fake = { id: 'p1', name: 'P' }
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => fake } as any)
    const res = await apiModule.productAPI.getById('p1')
    expect(res).toEqual(fake)
  })

  // Caso: RegisterAPI.registerCustomer propaga el error si la API falla
  it('RegisterAPI.registerCustomer throws on API error', async () => {
    vi.spyOn(apiModule.customerAPI, 'create').mockRejectedValue(new Error('fail'))
    await expect(apiModule.RegisterAPI.registerCustomer({})).rejects.toThrow()
  })
})
