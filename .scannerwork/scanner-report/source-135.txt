jest.mock('../../models/customer');
const Customer = require('../../models/customer');
const customerService = require('../../services/customerService');
describe('Pruebas unitarias de customerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =====================================================
  // PRUEBA: Obtener todos los clientes
  // =====================================================
  // Este test verifica que se devuelvan todos los clientes.
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

  
  // Este test verifica que falle si no existe el cliente buscado.
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
  // Este test verifica que se cree un cliente correctamente.
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
  // Este test verifica que falle al actualizar un cliente inexistente.
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
  // Este test verifica que falle al eliminar un cliente inexistente.
  test('Debe lanzar error si el cliente no existe al eliminar', async () => {

    // Simula que no existe el cliente a eliminar
    Customer.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    // Verifica que se lance el error esperado
    await expect(
      customerService.remove('1')
    ).rejects.toThrow('Customer not found');
  });

  // =====================================================
  // CASOS EXITOSOS: findById, update y remove
  // =====================================================
  // Este test verifica que findById devuelva el cliente cuando existe.
  test('findById debe retornar cliente cuando existe', async () => {
    Customer.findById = jest.fn().mockResolvedValue({ _id: '2', name: 'Existe' });
    const res = await customerService.findById('2');
    expect(Customer.findById).toHaveBeenCalledWith('2');
    expect(res.name).toBe('Existe');
  });

  // Este test verifica que update devuelva el cliente actualizado.
  test('update debe retornar objeto actualizado cuando existe', async () => {
    Customer.findByIdAndUpdate = jest.fn().mockResolvedValue({ _id: '3', name: 'Updated' });
    const res = await customerService.update('3', { name: 'Updated' });
    expect(Customer.findByIdAndUpdate).toHaveBeenCalledWith('3', { name: 'Updated' }, { new: true });
    expect(res.name).toBe('Updated');
  });

  // Este test verifica que remove devuelva el cliente eliminado.
  test('remove debe retornar eliminado cuando existe', async () => {
    Customer.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: '4' });
    const res = await customerService.remove('4');
    expect(Customer.findByIdAndDelete).toHaveBeenCalledWith('4');
    expect(res._id).toBe('4');
  });

});