// Simula el modelo ShoppingCart para evitar usar la base de datos real
jest.mock('../../models/shoppingCart');

// Importa el modelo ShoppingCart
const ShoppingCart = require('../../models/shoppingCart');

// Importa el servicio que vamos a probar
const shoppingCartService = require('../../services/shoppingCartService');

// Grupo de pruebas unitarias del servicio shoppingCartService
describe('Pruebas unitarias de shoppingCartService', () => {

  // Limpia todos los mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =====================================================
  // PRUEBA: Crear carrito de compras
  // =====================================================
  // Este test verifica que se cree un carrito y se guarde bien.
  test('Debe crear un carrito de compras y guardar los datos', async () => {

    // Simula la función save()
    const save = jest.fn().mockResolvedValue({
      idShoppingCart: 1
    });

    // Simula el constructor ShoppingCart
    const MockCart = jest.fn().mockImplementation(() => ({
      save
    }));

    // Reemplaza ShoppingCart con el mock
    ShoppingCart.mockImplementation(MockCart);

    // Ejecuta la función createShoppingCart()
    const resultado = await shoppingCartService.createShoppingCart({
      customer: 'x'
    });

    // Verifica que save() fue llamado
    expect(save).toHaveBeenCalled();

    // Verifica el ID del carrito creado
    expect(resultado.idShoppingCart).toBe(1);
  });

  // =====================================================
  // PRUEBA: Obtener todos los carritos
  // =====================================================
  // Este test verifica que se devuelvan todos los carritos.
  test('Debe retornar todos los carritos de compras', async () => {

    // Simula que find() devuelve un arreglo vacío
    ShoppingCart.find = jest.fn().mockResolvedValue([]);

    // Ejecuta la función
    const resultado = await shoppingCartService.getAllShoppingCarts();

    // Verifica que el resultado sea un arreglo vacío
    expect(resultado).toEqual([]);
  });

  // =====================================================
  // PRUEBA: Obtener carrito por ID
  // =====================================================
  // Este test verifica que se busque un carrito por id.
  test('Debe buscar un carrito por ID', async () => {

    // Simula que se encontró un carrito
    ShoppingCart.findOne = jest.fn().mockResolvedValue({
      idShoppingCart: 2
    });

    // Ejecuta la función
    const resultado = await shoppingCartService.getShoppingCartById(2);

    // Verifica que findOne() se llamó correctamente
    expect(ShoppingCart.findOne).toHaveBeenCalledWith({
      idShoppingCart: 2
    });

    // Verifica el ID obtenido
    expect(resultado.idShoppingCart).toBe(2);
  });

  // =====================================================
  // PRUEBA: Actualizar carrito
  // =====================================================
  // Este test verifica que se actualice un carrito existente.
  test('Debe actualizar un carrito de compras', async () => {

    // Simula la actualización del carrito
    ShoppingCart.findOneAndUpdate = jest.fn().mockResolvedValue({
      idShoppingCart: 3,
      total: 10
    });

    // Ejecuta la función updateShoppingCart()
    const resultado = await shoppingCartService.updateShoppingCart(3, {
      total: 10
    });

    // Verifica que findOneAndUpdate() fue llamado correctamente
    expect(ShoppingCart.findOneAndUpdate).toHaveBeenCalledWith(
      { idShoppingCart: 3 }, // condición de búsqueda
      { total: 10 },         // datos a actualizar
      { new: true }          // devuelve el documento actualizado
    );

    // Verifica el total actualizado
    expect(resultado.total).toBe(10);
  });

  // =====================================================
  // PRUEBA: Eliminar carrito
  // =====================================================
  // Este test verifica que se elimine un carrito.
  test('Debe eliminar un carrito de compras', async () => {

    // Simula que el carrito fue eliminado
    ShoppingCart.findOneAndDelete = jest.fn().mockResolvedValue({
      idShoppingCart: 4
    });

    // Ejecuta la función deleteShoppingCart()
    const resultado = await shoppingCartService.deleteShoppingCart(4);

    // Verifica que findOneAndDelete() fue llamado correctamente
    expect(ShoppingCart.findOneAndDelete).toHaveBeenCalledWith({
      idShoppingCart: 4
    });

    // Verifica el ID eliminado
    expect(resultado.idShoppingCart).toBe(4);
  });

  // =====================================================
  // PRUEBA: Obtener carrito por cliente
  // =====================================================
  // Este test verifica que se encuentre un carrito por cliente.
  test('Debe buscar un carrito usando el cliente', async () => {

    // Simula que se encontró un carrito del cliente
    ShoppingCart.findOne = jest.fn().mockResolvedValue({
      customer: 'u'
    });

    // Ejecuta la función
    const resultado = await shoppingCartService.getShoppingCartByCustomer('u');

    // Verifica que findOne() se llamó correctamente
    expect(ShoppingCart.findOne).toHaveBeenCalledWith({
      customer: 'u'
    });
  });

});