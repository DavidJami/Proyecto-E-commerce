const request = require("supertest");
const express = require("express");

jest.mock("../services/categoryService");
jest.mock("../middlewares/basicAuth", () => (req, res, next) => next());

const categoryService = require("../services/categoryService");
const categoryRoutes = require("../routes/categoryRoutes");

const app = express();
app.use(express.json());
app.use("/barroco/categories", categoryRoutes);

describe("Category API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /barroco/categories debe devolver todas las categorias", async () => {
    const mockCategories = [
      { _id: "1", name: "Ropa" },
      { _id: "2", name: "Accesorios" },
    ];
    categoryService.getAllCategories.mockResolvedValue(mockCategories);

    const res = await request(app).get("/barroco/categories");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockCategories);
    expect(categoryService.getAllCategories).toHaveBeenCalledTimes(1);
  });

  test("POST /barroco/categories debe crear una categoria", async () => {
    const newCategory = { name: "Calzado" };
    const createdCategory = { _id: "3", ...newCategory };
    categoryService.createCategory.mockResolvedValue(createdCategory);

    const res = await request(app)
      .post("/barroco/categories")
      .send(newCategory);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(createdCategory);
    expect(categoryService.createCategory).toHaveBeenCalledWith(newCategory);
  });

  test("GET /barroco/categories/:id debe devolver una categoria por id", async () => {
    const mockCategory = { _id: "1", name: "Ropa" };
    categoryService.getCategoryById.mockResolvedValue(mockCategory);

    const res = await request(app).get("/barroco/categories/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockCategory);
    expect(categoryService.getCategoryById).toHaveBeenCalledWith("1");
  });

  test("PUT /barroco/categories/:id debe actualizar una categoria", async () => {
    const updatedCategory = { _id: "1", name: "Moda" };
    categoryService.updateCategory.mockResolvedValue(updatedCategory);

    const res = await request(app)
      .put("/barroco/categories/1")
      .send({ name: "Moda" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(updatedCategory);
    expect(categoryService.updateCategory).toHaveBeenCalledWith("1", {
      name: "Moda",
    });
  });

  test("DELETE /barroco/categories/:id debe eliminar una categoria", async () => {
    const deletedCategory = { _id: "1", name: "Ropa" };
    categoryService.deleteCategory.mockResolvedValue(deletedCategory);

    const res = await request(app).delete("/barroco/categories/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      message: "Category deleted",
      category: deletedCategory,
    });
    expect(categoryService.deleteCategory).toHaveBeenCalledWith("1");
  });

  test("GET /barroco/categories/:id debe devolver 404 si no existe", async () => {
    categoryService.getCategoryById.mockRejectedValue(
      new Error("Category not found")
    );

    const res = await request(app).get("/barroco/categories/999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Category not found");
  });

  test("POST /barroco/categories debe devolver 400 si falla la creacion", async () => {
    categoryService.createCategory.mockRejectedValue(
      new Error("name is required")
    );

    const res = await request(app)
      .post("/barroco/categories")
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "name is required");
  });

  test("PUT /barroco/categories/:id debe devolver 404 si no existe", async () => {
    categoryService.updateCategory.mockRejectedValue(
      new Error("Category not found")
    );

    const res = await request(app)
      .put("/barroco/categories/999")
      .send({ name: "No existe" });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Category not found");
  });

  test("DELETE /barroco/categories/:id debe devolver 404 si no existe", async () => {
    categoryService.deleteCategory.mockRejectedValue(
      new Error("Category not found")
    );

    const res = await request(app).delete("/barroco/categories/999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Category not found");
  });
});