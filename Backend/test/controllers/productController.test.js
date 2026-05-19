jest.mock("../../services/productService");

const productService = require("../../services/productService");
const productController = require("../../controllers/productController");

function createRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("productController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Este test verifica que falle al pedir todos los productos.
  test("getAll debe responder 500 si falla el servicio", async () => {
    const req = {};
    const res = createRes();
    productService.getAllProducts.mockRejectedValue(new Error("boom"));

    await productController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "boom" });
  });

  // Este test verifica que falle al buscar un producto por id.
  test("getById debe responder 404 si falla el servicio", async () => {
    const req = { params: { id: "1" } };
    const res = createRes();
    productService.getProductById.mockRejectedValue(new Error("Producto no encontrado"));

    await productController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Producto no encontrado" });
  });

  // Este test verifica que falle al crear un producto.
  test("create debe responder 400 si falla el servicio", async () => {
    const req = { body: { name: "X" } };
    const res = createRes();
    productService.createProduct.mockRejectedValue(new Error("name is required"));

    await productController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "name is required" });
  });

  // Este test verifica que falle al actualizar un producto.
  test("update debe responder 404 si falla el servicio", async () => {
    const req = { params: { id: "1" }, body: { name: "Updated" } };
    const res = createRes();
    productService.updateProduct.mockRejectedValue(new Error("Producto no encontrado"));

    await productController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Producto no encontrado" });
  });

  // Este test verifica que falle al eliminar un producto.
  test("remove debe responder 404 si falla el servicio", async () => {
    const req = { params: { id: "1" } };
    const res = createRes();
    productService.deleteProduct.mockRejectedValue(new Error("Producto no encontrado"));

    await productController.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Producto no encontrado" });
  });

  // Este test verifica que falle al pedir los productos disponibles.
  test("getAvailable debe responder 500 si falla el servicio", async () => {
    const req = {};
    const res = createRes();
    productService.getAvailableProducts.mockRejectedValue(new Error("boom"));

    await productController.getAvailable(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "boom" });
  });

  // Este test verifica que falle al pedir los productos con descuento.
  test("getCustomDiscounted debe responder 500 si falla el servicio", async () => {
    const req = {};
    const res = createRes();
    productService.getCustomDiscountedProducts.mockRejectedValue(new Error("boom"));

    await productController.getCustomDiscounted(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "boom" });
  });

  // Este test verifica que falle al comprar un producto.
  test("purchase debe responder 400 si falla el servicio", async () => {
    const req = { params: { idProduct: "1" }, body: { quantity: 2 } };
    const res = createRes();
    productService.purchaseProduct.mockRejectedValue(new Error("Cantidad inválida"));

    await productController.purchase(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Cantidad inválida" });
  });
});