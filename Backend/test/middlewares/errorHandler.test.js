const errorHandler = require("../../middlewares/errorHandler");

describe("errorHandler middleware", () => {
  let req;
  let res;
  let next;
  let consoleErrorSpy;

  // Se prepara el response simulado antes de cada caso
  beforeEach(() => {
    req = {};
    res = {
      statusCode: 200,
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();

    // Evita que el error esperado ensucie la salida de los tests
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  // Se libera el spy de consola después de cada test
  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  // Debe responder 500 y ocultar el stack fuera de desarrollo
  test("responde 500 con mensaje genérico si el error no tiene mensaje", () => {
    const err = new Error();
    err.message = "";

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Error interno del servidor",
      stack: undefined,
    });
  });

  // Debe respetar el status code que ya trae la respuesta
  test("usa el statusCode existente cuando ya está definido", () => {
    const err = new Error("Recurso no encontrado");
    res.statusCode = 404;

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Recurso no encontrado",
      stack: undefined,
    });
  });

  // Debe caer en 500 cuando no hay statusCode previo en la respuesta
  test("usa 500 cuando no existe statusCode previo", () => {
    const err = new Error("Error sin statusCode");
    delete res.statusCode;

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Error sin statusCode",
      stack: undefined,
    });
  });

  // Debe incluir stack cuando el entorno es desarrollo
  test("incluye el stack en desarrollo", () => {
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const err = new Error("Falla de prueba");
    err.stack = "Error: Falla de prueba\n    at test";

    errorHandler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Falla de prueba",
      stack: "Error: Falla de prueba\n    at test",
    });

    process.env.NODE_ENV = previousNodeEnv;
  });

  // Debe usar el mensaje del error cuando no hay stack disponible
  test("usa err.message cuando err.stack está vacío", () => {
    const err = new Error("Mensaje de fallback");
    err.stack = "";

    errorHandler(err, req, res, next);

    expect(consoleErrorSpy).toHaveBeenCalledWith("🛑 ERROR:", "Mensaje de fallback");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Mensaje de fallback",
      stack: undefined,
    });
  });
});
