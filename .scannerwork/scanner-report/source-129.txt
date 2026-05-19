jest.mock("../../services/customerService");
jest.mock("../../models/customer");

const customerService = require("../../services/customerService");
const Customer = require("../../models/customer");
const customerController = require("../../controllers/customerController");

function createRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("customerController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Este test verifica que falle al buscar un customer inexistente.
  test("getById debe responder 404 cuando no existe", async () => {
    const req = { params: { id: "999" } };
    const res = createRes();
    customerService.findById.mockResolvedValue(null);

    await customerController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Customer not found" });
  });

  // Este test verifica que se devuelva el customer cuando existe.
  test("getById debe responder el customer cuando existe", async () => {
    const req = { params: { id: "1" } };
    const res = createRes();
    const customer = { _id: "1", name: "Juan" };
    customerService.findById.mockResolvedValue(customer);

    await customerController.getById(req, res);

    expect(res.json).toHaveBeenCalledWith(customer);
  });

  // Este test verifica que se actualice el rol del customer.
  test("updateRole debe actualizar el rol si el customer existe", async () => {
    const req = { body: { email: "a@b.com", role: "admin" } };
    const res = createRes();
    const customer = { email: "a@b.com", role: "admin" };
    Customer.findOneAndUpdate.mockResolvedValue(customer);

    await customerController.updateRole(req, res);

    expect(Customer.findOneAndUpdate).toHaveBeenCalledWith(
      { email: "a@b.com" },
      { role: "admin" },
      { new: true }
    );
    expect(res.json).toHaveBeenCalledWith({
      message: "Rol actualizado exitosamente",
      customer,
    });
  });

  // Este test verifica que falle si no encuentra el usuario.
  test("updateRole debe responder 404 cuando no encuentra usuario", async () => {
    const req = { body: { email: "a@b.com", role: "admin" } };
    const res = createRes();
    Customer.findOneAndUpdate.mockResolvedValue(null);

    await customerController.updateRole(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Usuario no encontrado" });
  });

  // Este test verifica que falle si actualizar el rol da error.
  test("updateRole debe responder 500 cuando falla la operacion", async () => {
    const req = { body: { email: "a@b.com", role: "admin" } };
    const res = createRes();
    Customer.findOneAndUpdate.mockRejectedValue(new Error("db error"));

    await customerController.updateRole(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Error al actualizar rol" });
  });

  // Este test verifica que diga que no hay admin.
  test("checkAdminExists debe responder que no hay admin cuando no existe", async () => {
    const req = {};
    const res = createRes();
    Customer.exists.mockResolvedValue(null);

    await customerController.checkAdminExists(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "No hay ningún admin" });
  });

  // Este test verifica que encuentre un admin.
  test("checkAdminExists debe responder cuando existe un admin", async () => {
    const req = {};
    const res = createRes();
    Customer.exists.mockResolvedValue({ _id: "admin-1" });

    await customerController.checkAdminExists(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "Admin encontrado" });
  });

  // Este test verifica que falle al revisar si existe un admin.
  test("checkAdminExists debe responder 500 cuando falla la operacion", async () => {
    const req = {};
    const res = createRes();
    Customer.exists.mockRejectedValue(new Error("db error"));

    await customerController.checkAdminExists(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Error al verificar admin" });
  });
});