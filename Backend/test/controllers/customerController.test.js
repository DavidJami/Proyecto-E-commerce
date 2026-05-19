const customerController = require('../../controllers/customerController');
const customerService = require('../../services/customerService');
const Customer = require('../../models/customer');

jest.mock('../../services/customerService');
jest.mock('../../models/customer');

describe('customerController', () => {

    let req;
    let res;
    let consoleErrorSpy;

    beforeEach(() => {

        req = {
            params: {},
            body: {}
        };

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        jest.clearAllMocks();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    // =====================================================
    // getById -> cliente NO encontrado
    // =====================================================
    test('Debe retornar 404 si el cliente no existe', async () => {

        customerService.findById.mockResolvedValue(null);

        req.params.id = '1';

        await customerController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Customer not found'
        });
    });

    // =====================================================
    // updateRole -> éxito
    // =====================================================
    test('Debe actualizar el rol correctamente', async () => {

        req.body = {
            email: 'test@test.com',
            role: 'admin'
        };

        Customer.findOneAndUpdate.mockResolvedValue({
            email: 'test@test.com',
            role: 'admin'
        });

        await customerController.updateRole(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Rol actualizado exitosamente',
            customer: expect.any(Object)
        });
    });

    // =====================================================
    // updateRole -> usuario no encontrado
    // =====================================================
    test('Debe retornar 404 si el usuario no existe', async () => {

        req.body = {
            email: 'fake@test.com',
            role: 'admin'
        };

        Customer.findOneAndUpdate.mockResolvedValue(null);

        await customerController.updateRole(req, res);

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Usuario no encontrado'
        });
    });

    // =====================================================
    // updateRole -> error interno
    // =====================================================
    test('Debe retornar error 500 en updateRole', async () => {

        req.body = {
            email: 'test@test.com',
            role: 'admin'
        };

        Customer.findOneAndUpdate.mockRejectedValue(
            new Error('Error DB')
        );

        await customerController.updateRole(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Error al actualizar rol'
        });
    });

    // =====================================================
    // checkAdminExists -> admin encontrado
    // =====================================================
    test('Debe indicar que existe un admin', async () => {

        Customer.exists.mockResolvedValue(true);

        await customerController.checkAdminExists(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Admin encontrado'
        });
    });

    // =====================================================
    // checkAdminExists -> no existe admin
    // =====================================================
    test('Debe indicar que no existe admin', async () => {

        Customer.exists.mockResolvedValue(false);

        await customerController.checkAdminExists(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: 'No hay ningún admin'
        });
    });

    // =====================================================
    // checkAdminExists -> error interno
    // =====================================================
    test('Debe retornar error 500 al verificar admin', async () => {

        Customer.exists.mockRejectedValue(
            new Error('Error DB')
        );

        await customerController.checkAdminExists(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Error al verificar admin'
        });
    });

});