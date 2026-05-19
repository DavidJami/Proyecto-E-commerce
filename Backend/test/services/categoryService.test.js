jest.mock('../../models/category');

const Category = require('../../models/category');
const categoryService = require('../../services/categoryService');

describe('Pruebas unitarias de categoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Este test verifica que se devuelvan todas las categorias.
  test('Debe retornar todas las categorias', async () => {
    Category.find = jest.fn().mockResolvedValue([
      { _id: '1', name: 'Ropa' },
      { _id: '2', name: 'Accesorios' }
    ]);

    const resultado = await categoryService.getAllCategories();

    expect(Category.find).toHaveBeenCalledTimes(1);
    expect(resultado).toEqual([
      { _id: '1', name: 'Ropa' },
      { _id: '2', name: 'Accesorios' }
    ]);
  });

  // Este test verifica que se encuentre una categoria por id.
  test('Debe retornar una categoria por id cuando existe', async () => {
    const categoria = { _id: '1', name: 'Ropa' };
    Category.findById = jest.fn().mockResolvedValue(categoria);

    const resultado = await categoryService.getCategoryById('1');

    expect(Category.findById).toHaveBeenCalledWith('1');
    expect(resultado).toEqual(categoria);
  });

  // Este test verifica que falle si la categoria no existe.
  test('Debe lanzar error si la categoria por id no existe', async () => {
    Category.findById = jest.fn().mockResolvedValue(null);

    await expect(categoryService.getCategoryById('999')).rejects.toThrow('Category not found');
  });

  // Este test verifica que se cree una categoria nueva.
  test('Debe crear una categoria nueva', async () => {
    const datos = { name: 'Calzado' };
    const save = jest.fn().mockResolvedValue({ _id: '3', ...datos });
    const MockCategory = jest.fn().mockImplementation(() => ({ save }));

    MockCategory.find = jest.fn();
    MockCategory.findById = jest.fn();

    Category.mockImplementation(MockCategory);

    const resultado = await categoryService.createCategory(datos);

    expect(save).toHaveBeenCalledTimes(1);
    expect(resultado).toEqual({ _id: '3', ...datos });
  });

  // Este test verifica que se actualice una categoria existente.
  test('Debe actualizar una categoria existente', async () => {
    const updated = { _id: '1', name: 'Moda' };
    Category.findByIdAndUpdate = jest.fn().mockResolvedValue(updated);

    const resultado = await categoryService.updateCategory('1', { name: 'Moda' });

    expect(Category.findByIdAndUpdate).toHaveBeenCalledWith('1', { name: 'Moda' }, { new: true });
    expect(resultado).toEqual(updated);
  });

  // Este test verifica que falle al actualizar una categoria inexistente.
  test('Debe lanzar error si la categoria a actualizar no existe', async () => {
    Category.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    await expect(categoryService.updateCategory('999', { name: 'No existe' })).rejects.toThrow('Category not found');
  });

  // Este test verifica que se elimine una categoria existente.
  test('Debe eliminar una categoria existente', async () => {
    const deleted = { _id: '1', name: 'Ropa' };
    Category.findByIdAndDelete = jest.fn().mockResolvedValue(deleted);

    const resultado = await categoryService.deleteCategory('1');

    expect(Category.findByIdAndDelete).toHaveBeenCalledWith('1');
    expect(resultado).toEqual(deleted);
  });

  // Este test verifica que falle al eliminar una categoria inexistente.
  test('Debe lanzar error si la categoria a eliminar no existe', async () => {
    Category.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    await expect(categoryService.deleteCategory('999')).rejects.toThrow('Category not found');
  });
});
