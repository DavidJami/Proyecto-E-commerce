
jest.mock('bcryptjs');
const bcrypt = require('bcryptjs');
const Customer = require('../../models/customer');
function obtenerFuncionesPreSave(schema) {
  const funciones = [];

  // -------------------------------------------------
  // Busca hooks en versiones modernas de mongoose
  // -------------------------------------------------
  if (
    schema &&
    schema.s &&
    schema.s.hooks &&
    schema.s.hooks._pres &&
    schema.s.hooks._pres.get("save")
  ) {

    const arreglo = schema.s.hooks._pres.get("save");

    arreglo.forEach(item => {

      // Guarda la función encontrada
      if (item && (item.fn || typeof item === 'function')) {
        funciones.push(item.fn || item);
      }
    });
  }

  // -------------------------------------------------
  // Busca hooks en otras versiones de mongoose
  // -------------------------------------------------
  if (schema && schema.stack && Array.isArray(schema.stack)) {

    schema.stack.forEach(item => {

      if (
        item &&
        item.kind === 'pre' &&
        item.hook === 'save' &&
        item.fn
      ) {
        funciones.push(item.fn);
      }
    });
  }

  // -------------------------------------------------
  // Busca middleware en versiones antiguas
  // -------------------------------------------------
  if (schema && schema._middleware && Array.isArray(schema._middleware)) {

    schema._middleware.forEach(middleware => {

      if (
        middleware.hook === 'save' &&
        middleware.fn
      ) {
        funciones.push(middleware.fn);
      }
    });
  }

  // -------------------------------------------------
  // Elimina funciones repetidas
  // -------------------------------------------------
  return Array.from(new Set(funciones));
}

function obtenerMiddlewareDePassword(schema) {
  const funciones = obtenerFuncionesPreSave(schema);

  const middlewareDePassword = funciones.find((funcion) => {
    const source = funcion && funcion.toString ? funcion.toString() : "";
    return source.includes("bcrypt.genSalt") || source.includes("bcrypt.hash");
  });

  return middlewareDePassword ? [middlewareDePassword] : funciones;
}

// =====================================================
// PRUEBAS DEL MODELO CUSTOMER
// =====================================================
describe('Pruebas de hooks y métodos del modelo Customer', () => {

  // Limpia todos los mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =====================================================
  // PRUEBA: comparePassword()
  // =====================================================
  // Este test verifica que comparePassword use bcrypt.compare.
  test('Debe comparar contraseñas usando bcrypt.compare', async () => {

    // Simula que las contraseñas coinciden
    bcrypt.compare.mockResolvedValue(true);

    // Crea un cliente de prueba
    const cliente = new Customer({
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.com',
      password: 'hashed',
      phone: '1',
      billingAddress: 'direccion'
    });

    // Ejecuta comparePassword()
    const resultado = await cliente.comparePassword('candidate');

    // Verifica que bcrypt.compare() fue llamado correctamente
    expect(bcrypt.compare).toHaveBeenCalledWith(
      'candidate',
      'hashed'
    );

    // Verifica que la comparación devolvió true
    expect(resultado).toBe(true);
  });

  // =====================================================
  // PRUEBA: Hook pre save
  // =====================================================
  // Este test verifica que la contraseña se cifre solo cuando cambia.
  test('Debe cifrar la contraseña si fue modificada y omitirlo si no cambió', async () => {

    // -------------------------------------------------
    // Configuración de mocks de bcrypt
    // -------------------------------------------------

    // Simula generación de salt
    bcrypt.genSalt.mockResolvedValue('salt');

    // Simula hash de contraseña
    bcrypt.hash.mockImplementation((password, salt) => {
      return Promise.resolve(
        'hashed-' + password + '-' + salt
      );
    });

    // Obtiene el schema del modelo
    const schema = Customer.schema;

    // Obtiene las funciones pre save (usa preferentemente el middleware exportado)
    let funcionesPreSave = [];
    if (Customer.hashPasswordMiddleware) {
      funcionesPreSave = [Customer.hashPasswordMiddleware];
    } else {
      funcionesPreSave = obtenerMiddlewareDePassword(schema);
    }

    // Verifica que existan hooks o el fallback
    expect(funcionesPreSave.length).toBeGreaterThan(0);

    // =================================================
    // CASO 1:
    // La contraseña fue modificada
    // =================================================

    // Documento simulado
    const documento1 = {

      // Simula que password fue modificada
      isModified: (campo) => campo === 'password',

      // Contraseña original
      password: 'plain'
    };

    // Función next simulada
    const next1 = jest.fn();

    // Ejecuta todas las funciones pre save
    for (const funcion of funcionesPreSave) {

      const resultado = funcion.call(documento1, next1);

      // Espera promesas async
      if (resultado && typeof resultado.then === 'function') {
        await resultado;
      }
    }

    // Verifica que genSalt() fue llamado
    expect(bcrypt.genSalt).toHaveBeenCalled();

    // Verifica que hash() fue llamado correctamente
    expect(bcrypt.hash).toHaveBeenCalledWith(
      'plain',
      'salt'
    );

    // Verifica que la contraseña fue cifrada
    expect(documento1.password)
      .toMatch(/^hashed-plain-salt/);

    // =================================================
    // CASO 2:
    // La contraseña NO fue modificada
    // =================================================

    const documento2 = {

      // Simula que ningún campo fue modificado
      isModified: () => false,

      // Contraseña original
      password: 'plain2'
    };

    // Mock de next()
    const next2 = jest.fn();

    // Ejecuta nuevamente hooks pre save
    for (const funcion of funcionesPreSave) {

      const resultado = funcion.call(documento2, next2);

      // Espera funciones async
      if (resultado && typeof resultado.then === 'function') {
        await resultado;
      }
    }

    // Verifica que next() fue llamado
    expect(next2).toHaveBeenCalled();

    // Verifica que NO se hizo hash de plain2
    expect(bcrypt.hash)
      .not.toHaveBeenCalledWith(
        'plain2',
        expect.anything()
      );
  });

  // Este test verifica que el hook avise si falla el cifrado.
  test('Debe llamar next con error si falla el hash de la contraseña', async () => {

    bcrypt.genSalt.mockRejectedValue(new Error('hash failed'));

    const schema = Customer.schema;
    const funcionesPreSave = Customer.hashPasswordMiddleware
      ? [Customer.hashPasswordMiddleware]
      : obtenerMiddlewareDePassword(schema);

    expect(funcionesPreSave.length).toBeGreaterThan(0);

    const documento = {
      isModified: (campo) => campo === 'password',
      password: 'plain'
    };

    const next = jest.fn();

    for (const funcion of funcionesPreSave) {
      const resultado = funcion.call(documento, next);

      if (resultado && typeof resultado.then === 'function') {
        await resultado;
      }
    }

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(documento.password).toBe('plain');
  });

});
