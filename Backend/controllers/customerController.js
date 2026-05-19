const customerService = require('../services/customerService');
const Customer = require('../models/customer');

exports.getAll = async (req, res) => {
    const customers = await customerService.findAll();
    res.json(customers);
};

exports.getById = async (req, res) => {
    const customer = await customerService.findById(req.params.id);
    customer
        ? res.json(customer)
        : res.status(404).json({ message: 'Customer not found' });
};

exports.create = async (req, res) => {
    const newCustomer = await customerService.create(req.body);
    res.status(201).json(newCustomer);
};

exports.update = async (req, res) => {
    await customerService.update(req.params.id, req.body);
    res.json({ message: 'Customer updated successfully' });
};

exports.remove = async (req, res) => {
    await customerService.remove(req.params.id);
    res.json({ message: 'Customer deleted successfully' });
};

exports.updateRole = async (req, res) => {
    try {
        const { email, role } = req.body;
        const customer = await Customer.findOneAndUpdate(
            { email },
            { role },
            { new: true }
        );

        if (!customer) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Rol actualizado exitosamente', customer });
    } catch (error) {
        //console.error('Error al actualizar rol:', error);
        res.status(500).json({ message: 'Error al actualizar rol' });
    }
};

exports.checkAdminExists = async (req, res) => {
    try {
        const adminExists = await Customer.exists({ role: 'admin' });

        if (adminExists) {
            return res.json({ message: 'Admin encontrado' });
        } else {
            return res.json({ message: 'No hay ningún admin' });
        }
    } catch (error) {
        //console.error('Error al verificar admin:', error);
        res.status(500).json({ message: 'Error al verificar admin' });
    }
};
