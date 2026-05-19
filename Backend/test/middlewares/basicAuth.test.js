jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

const basicAuth = require("../../middlewares/basicAuth");

describe("basicAuth middleware", () => {
  let req;
  let res;
  let next;
  const originalEnv = process.env;

  // Se prepara un request y response simulados antes de cada caso
  beforeEach(() => {
    req = { headers: {} };
    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    next = jest.fn();

    process.env = { ...originalEnv, BASIC_USER: "admin", BASIC_PASS: "1234" };
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  // Se limpia el entorno y los mocks después de cada test
  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  // Debe bloquear si falta el header Authorization
  test("rechaza la petición si no hay Authorization", () => {
    basicAuth(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith(
      "WWW-Authenticate",
      'Basic realm="Restricted Area"'
    );
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith("Authentication required.");
    expect(next).not.toHaveBeenCalled();
  });

  // Debe bloquear si las credenciales no coinciden
  test("rechaza la petición si las credenciales son incorrectas", () => {
    const credentials = Buffer.from("wrong:wrong").toString("base64");
    req.headers.authorization = `Basic ${credentials}`;

    basicAuth(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith(
      "WWW-Authenticate",
      'Basic realm="Restricted Area"'
    );
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    expect(next).not.toHaveBeenCalled();
  });

  // Debe dejar pasar si las credenciales son correctas
  test("permite el acceso si las credenciales son correctas", () => {
    const credentials = Buffer.from("admin:1234").toString("base64");
    req.headers.authorization = `Basic ${credentials}`;

    basicAuth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});
