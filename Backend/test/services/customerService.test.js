// Simula el modelo Customer para no usar la base de datos real
jest.mock('../../models/customer');

// Importa el modelo Customer
const Customer = require('../../models/customer');

// Importa el servicio que vamos a probar
const customerService = require('../../services/customerService');

// Grupo de pruebas del servicio customerService
describe('Pruebas unitarias de customerService', () => {

  // Antes de cada prueba limpia todos los mocks
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =====================================================
  // PRUEBA: Obtener todos los clientes
  // =====================================================
  test('Debe retornar todos los clientes', async () => {

    // Simula que Customer.find() devuelve un arreglo con clientes
    Customer.find = jest.fn().mockResolvedValue([
      { name: 'Carlos' }
    ]);

    // Ejecuta la función del servicio
    const resultado = await customerService.findAll();

    // Verifica que Customer.find() haya sido llamado
    expect(Customer.find).toHaveBeenCalled();

    // Verifica que el resultado sea el esperado
    expect(resultado).toEqual([
      { name: 'Carlos' }
    ]);
  });

  // =====================================================
  // PRUEBA: Buscar cliente por ID inexistente
  // =====================================================
  test('Debe lanzar error si el cliente no existe al buscar por ID', async () => {

    // Simula que no se encontró ningún cliente
    Customer.findById = jest.fn().mockResolvedValue(null);

    // Verifica que se lance el error esperado
    await expect(
      customerService.findById('123')
    ).rejects.toThrow('Customer not found');
  });

  // =====================================================
  // PRUEBA: Crear un cliente
  // =====================================================
  test('Debe crear un cliente correctamente', async () => {

    // Simula la creación de un cliente
    Customer.create = jest.fn().mockResolvedValue({
      _id: '1',
      name: 'Nuevo Cliente'
    });

    // Ejecuta la función create()
    const resultado = await customerService.create({
      name: 'Nuevo Cliente'
    });

    // Verifica que create() reciba los datos correctos
    expect(Customer.create).toHaveBeenCalledWith({
      name: 'Nuevo Cliente'
    });

    // Verifica que el cliente creado tenga ID
    expect(resultado._id).toBe('1');
  });

  // =====================================================
  // PRUEBA: Actualizar cliente inexistente
  // =====================================================
  test('Debe lanzar error si el cliente no existe al actualizar', async () => {

    // Simula que el cliente no fue encontrado
    Customer.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    // Verifica que se lance el error esperado
    await expect(
      customerService.update('1', {
        name: 'Actualizado'
      })
    ).rejects.toThrow('Customer not found');
  });

  // =====================================================
  // PRUEBA: Eliminar cliente inexistente
  // =====================================================
  test('Debe lanzar error si el cliente no existe al eliminar', async () => {

    // Simula que no existe el cliente a eliminar
    Customer.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    // Verifica que se lance el error esperado
    await expect(
      customerService.remove('1')
    ).rejects.toThrow('Customer not found');
  });

});