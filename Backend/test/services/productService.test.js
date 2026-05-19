// Simula el modelo Product antes de importar el servicio
// Esto evita usar la base de datos real en las pruebas
jest.mock('../../models/product');

// Importa el modelo Product
const Product = require('../../models/product');

// Importa el servicio que vamos a probar
const productService = require('../../services/productService');

// Grupo de pruebas unitarias del servicio de productos
describe('Pruebas unitarias de productService', () => {

  // Limpia todos los mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =====================================================
  // PRUEBA: Obtener todos los productos
  // =====================================================
  // Este test verifica que se devuelva la lista de productos.
  test('Debe retornar la lista de productos', async () => {

    // Simula que Product.find() devuelve productos
    Product.find = jest.fn().mockResolvedValue([
      { name: 'Producto A' }
    ]);

    // Ejecuta la función del servicio
    const resultado = await productService.getAllProducts();

    // Verifica que find() se llamó con un objeto vacío
    expect(Product.find).toHaveBeenCalledWith({});

    // Verifica que el resultado sea correcto
    expect(resultado).toEqual([
      { name: 'Producto A' }
    ]);
  });

  // =====================================================
  // PRUEBA: Buscar producto por ID inexistente
  // =====================================================
  // Este test verifica que falle si el producto no existe.
  test('Debe lanzar error si el producto no existe', async () => {

    // Simula que no se encontró el producto
    Product.findById = jest.fn().mockResolvedValue(null);

    // Verifica que se lance el error esperado
    await expect(
      productService.getProductById('x')
    ).rejects.toThrow('Producto no encontrado');
  });

  // =====================================================
  // PRUEBA: Crear un producto
  // =====================================================
  // Este test verifica que se guarde un producto nuevo.
  test('Debe guardar y retornar un producto nuevo', async () => {

    // Datos del nuevo producto
    const datos = {
      name: 'Nuevo Producto',
      price: 10
    };

    // Simula la función save()
    const save = jest.fn().mockResolvedValue({
      _id: '1',
      ...datos
    });

    // Simula el constructor Product
    const MockProduct = jest.fn().mockImplementation(() => ({
      save
    }));

    // Simula métodos estáticos vacíos
    MockProduct.find = jest.fn();
    MockProduct.findById = jest.fn();

    // Reemplaza Product por el mock
    Product.mockImplementation(MockProduct);

    // Ejecuta createProduct()
    const creado = await productService.createProduct(datos);

    // Verifica que save() fue ejecutado
    expect(save).toHaveBeenCalled();

    // Verifica el producto creado
    expect(creado).toEqual({
      _id: '1',
      ...datos
    });
  });

  // =====================================================
  // PRUEBA: Productos con descuento personalizado
  // =====================================================
  // Este test verifica que el descuento se calcule bien.
  test('Debe calcular correctamente el precio con descuento', async () => {

    // Simula productos obtenidos de la base de datos
    Product.find = jest.fn().mockResolvedValue([
      {
        idProduct: 'p1',
        name: 'Producto',
        description: 'Descripción',
        price: 100,
        stock: 2,
        cathegory: 'Categoría',
        custom: true
      }
    ]);

    // Ejecuta la función
    const resultado = await productService.getCustomDiscountedProducts();

    // Verifica que el descuento sea correcto
    // 100 - 10% = 90
    expect(resultado[0].discountedPrice).toBe(90);
  });

  // Este test verifica que no falle cuando no hay productos personalizados.
  test('Debe retornar arreglo vacío si no hay productos personalizados', async () => {
    Product.find = jest.fn().mockResolvedValue([]);

    const resultado = await productService.getCustomDiscountedProducts();

    expect(Product.find).toHaveBeenCalledWith({ custom: true });
    expect(resultado).toEqual([]);
  });

  // =====================================================
  // PRUEBA: Compra de producto
  // =====================================================
  // Este test verifica los errores y el flujo correcto de compra.
  test('Debe validar errores y compra exitosa', async () => {

    // -------------------------------------------------
    // Caso 1: Cantidad inválida
    // -------------------------------------------------

    // Verifica que no se permita comprar 0 productos
    await expect(
      productService.purchaseProduct('p', 0)
    ).rejects.toThrow('Cantidad inválida');

    // -------------------------------------------------
    // Caso 2: Producto no encontrado
    // -------------------------------------------------

    // Simula que el producto no existe
    Product.findOne = jest.fn().mockResolvedValue(null);

    // Verifica el error
    await expect(
      productService.purchaseProduct('p', 1)
    ).rejects.toThrow('Producto no encontrado');

    // -------------------------------------------------
    // Caso 3: Stock insuficiente
    // -------------------------------------------------

    // Simula un producto con poco stock
    const productoStockBajo = {
      idProduct: 'p',
      stock: 1,
      price: 10
    };

    Product.findOne = jest.fn().mockResolvedValue(productoStockBajo);

    // Verifica que se lance el error
    await expect(
      productService.purchaseProduct('p', 2)
    ).rejects.toThrow('Stock insuficiente');

    // -------------------------------------------------
    // Caso 4: Compra exitosa
    // -------------------------------------------------

    // Simula un producto válido
    const producto = {
      idProduct: 'p',
      stock: 5,
      price: 10,
      name: 'Producto X',

      // Simula guardar cambios
      save: jest.fn().mockResolvedValue(true)
    };

    // Simula encontrar el producto
    Product.findOne = jest.fn().mockResolvedValue(producto);

    // Ejecuta la compra
    const resultado = await productService.purchaseProduct('p', 2);

    // Verifica que save() se llamó
    expect(producto.save).toHaveBeenCalled();

    // Verifica el precio total
    // 2 productos * $10 = $20
    expect(resultado.totalPrice).toBe(20);
  });

  // Este test verifica que falle al actualizar un producto inexistente.
  test('Debe lanzar error al actualizar si el producto no existe', async () => {
    Product.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    await expect(
      productService.updateProduct('1', { name: 'X' })
    ).rejects.toThrow('Producto no encontrado');
  });

  // Este test verifica que falle al eliminar un producto inexistente.
  test('Debe lanzar error al eliminar si el producto no existe', async () => {
    Product.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    await expect(
      productService.deleteProduct('1')
    ).rejects.toThrow('Producto no encontrado');
  });

    // =====================================================
    // PRUEBA: Productos disponibles, getById, update y delete
    // =====================================================
    // Este test verifica consultas y operaciones CRUD de productos.
    test('Debe retornar productos disponibles y operaciones CRUD', async () => {
      // getAvailableProducts
      Product.find = jest.fn().mockResolvedValue([{ idProduct: 'a', stock: 2 }]);
      const disponibles = await productService.getAvailableProducts();
      expect(Product.find).toHaveBeenCalledWith({ stock: { $gt: 0 } });
      expect(disponibles.length).toBeGreaterThan(0);

      // getProductById success
      const mockProd = { _id: '1', name: 'P1' };
      Product.findById = jest.fn().mockResolvedValue(mockProd);
      const encontrado = await productService.getProductById('1');
      expect(Product.findById).toHaveBeenCalledWith('1');
      expect(encontrado).toEqual(mockProd);

      // updateProduct success
      const updated = { _id: '1', name: 'P1 updated' };
      Product.findByIdAndUpdate = jest.fn().mockResolvedValue(updated);
      const resUpdate = await productService.updateProduct('1', { name: 'P1 updated' });
      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith('1', { name: 'P1 updated' }, { new: true });
      expect(resUpdate).toEqual(updated);

      // deleteProduct success
      const deleted = { _id: '1' };
      Product.findByIdAndDelete = jest.fn().mockResolvedValue(deleted);
      const resDel = await productService.deleteProduct('1');
      expect(Product.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(resDel).toEqual(deleted);
    });

});