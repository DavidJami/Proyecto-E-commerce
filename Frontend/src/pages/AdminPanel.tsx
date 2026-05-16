import { useState } from "react";
import { productAPI, categoryAPI, customerAPI } from "@/lib/api";

const AdminPanel = () => {
  const [productForm, setProductForm] = useState({ name: "", price: "", description: "" });
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });
  const [roleForm, setRoleForm] = useState({ email: "", role: "" });

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productAPI.create(productForm);
      alert("Producto creado exitosamente");
    } catch (error) {
      console.error("Error al crear producto:", error);
      alert("Error al crear producto");
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await categoryAPI.create(categoryForm);
      alert("Categoría creada exitosamente");
    } catch (error) {
      console.error("Error al crear categoría:", error);
      alert("Error al crear categoría");
    }
  };

  const handleRoleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await customerAPI.updateRole(roleForm.email, roleForm.role);
      alert("Rol actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      alert("Error al actualizar rol");
    }
  };

  return (
    <div>
      <h1>Panel de Administración</h1>

      <form onSubmit={handleProductSubmit}>
        <h2>Crear Producto</h2>
        <input name="name" placeholder="Nombre" onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
        <input name="price" placeholder="Precio" onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
        <textarea name="description" placeholder="Descripción" onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
        <button type="submit">Crear Producto</button>
      </form>

      <form onSubmit={handleCategorySubmit}>
        <h2>Crear Categoría</h2>
        <input name="name" placeholder="Nombre" onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} />
        <textarea name="description" placeholder="Descripción" onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
        <button type="submit">Crear Categoría</button>
      </form>

      <form onSubmit={handleRoleChange}>
        <h2>Cambiar Rol de Usuario</h2>
        <input name="email" placeholder="Correo del usuario" onChange={(e) => setRoleForm({ ...roleForm, email: e.target.value })} />
        <input name="role" placeholder="Nuevo rol" onChange={(e) => setRoleForm({ ...roleForm, role: e.target.value })} />
        <button type="submit">Actualizar Rol</button>
      </form>
    </div>
  );
};

export default AdminPanel;