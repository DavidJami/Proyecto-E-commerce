import { useState, useEffect } from "react";
import { productAPI, categoryAPI, customerAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const AdminPanel = () => {
  const { toast } = useToast();

  const [productForm, setProductForm] = useState({ idProduct: "", name: "", price: "", description: "", stock: "", category: "", url: "" });
  const [categoryForm, setCategoryForm] = useState({ categoryID: "", name: "", description: "" });
  const [roleForm, setRoleForm] = useState({ email: "", role: "" });
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        idProduct: productForm.idProduct,
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price) || 0,
        stock: Number(productForm.stock) || 0,
        category: productForm.category || undefined,
        url: productForm.url || undefined,
      };
      if (editingProductId) {
        await productAPI.update(editingProductId, payload);
      } else {
        await productAPI.create(payload);
      }
      toast({ title: "Producto creado", description: "Producto creado exitosamente" });
      setProductForm({ idProduct: "", name: "", price: "", description: "", stock: "", category: "", url: "" });
      setEditingProductId(null);
      await loadProducts();
    } catch (error) {
      console.error("Error al crear producto:", error);
      toast({ title: "Error", description: "No se pudo crear el producto", variant: "destructive" });
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        categoryID: Number(categoryForm.categoryID),
        name: categoryForm.name,
        description: categoryForm.description,
      };
      if (editingCategoryId) {
        await categoryAPI.update(editingCategoryId, payload);
      } else {
        await categoryAPI.create(payload);
      }
      toast({ title: "Categoría creada", description: "Categoría creada exitosamente" });
      setCategoryForm({ categoryID: "", name: "", description: "" });
      setEditingCategoryId(null);
      await loadCategories();
    } catch (error) {
      console.error("Error al crear categoría:", error);
      toast({ title: "Error", description: "No se pudo crear la categoría", variant: "destructive" });
    }
  };

  const handleRoleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await customerAPI.updateRole(roleForm.email, roleForm.role);
      toast({ title: "Rol actualizado", description: "Rol actualizado exitosamente" });
      setRoleForm({ email: "", role: "" });
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      toast({ title: "Error", description: "No se pudo actualizar el rol", variant: "destructive" });
    }
  };

  const loadProducts = async () => {
    try {
      const list = await productAPI.getAll();
      setProducts(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const list = await categoryAPI.getAll();
      setCategories(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const startEditProduct = (p: any) => {
    setEditingProductId(p._id);
    const catVal = p?.category ? (p.category._id ? p.category._id : p.category) : "";
    setProductForm({ idProduct: p.idProduct || "", name: p.name || "", price: String(p.price || ""), description: p.description || "", stock: String(p.stock || ""), category: String(catVal), url: p.url || "" });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startEditCategory = (c: any) => {
    setEditingCategoryId(c._id);
    setCategoryForm({ categoryID: String(c.categoryID || ""), name: c.name || "", description: c.description || "" });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('¿Eliminar producto?')) return;
    try {
      await productAPI.delete(id);
      toast({ title: 'Producto eliminado' });
      await loadProducts();
    } catch (error) {
      console.error('Error al eliminar producto', error);
      toast({ title: 'Error', description: 'No se pudo eliminar el producto', variant: 'destructive' });
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('¿Eliminar categoría?')) return;
    try {
      await categoryAPI.delete(id);
      toast({ title: 'Categoría eliminada' });
      await loadCategories();
    } catch (error) {
      console.error('Error al eliminar categoría', error);
      toast({ title: 'Error', description: 'No se pudo eliminar la categoría', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">Panel de Administración</h1>

      <form onSubmit={handleProductSubmit} className="space-y-4 bg-card p-4 rounded">
        <h2 className="text-lg font-semibold">Crear Producto</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Id Producto</Label>
            <Input value={productForm.idProduct} onChange={(e) => setProductForm({ ...productForm, idProduct: e.target.value })} required />
          </div>
          <div>
            <Label>Nombre</Label>
            <Input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Precio</Label>
            <Input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
          </div>
          <div>
            <Label>Stock</Label>
            <Input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />
          </div>
        </div>

          <div>
            <Label>Categoría</Label>
            <select className="w-full rounded border p-2" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}>
              <option value="">-- Sin categoría --</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name} ({c.categoryID})</option>
              ))}
            </select>
          </div>

        <div>
          <Label>Image URL</Label>
          <Input value={productForm.url} onChange={(e) => setProductForm({ ...productForm, url: e.target.value })} placeholder="https://.../imagen.jpg" />
        </div>

        <div>
          <Label>Descripción</Label>
          <Textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
        </div>

        <Button type="submit">Crear Producto</Button>
      </form>

      <div className="bg-card p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Productos existentes</h2>
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay productos</p>
        ) : (
          <div className="space-y-2">
            {products.map((p) => (
              <div key={p._id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <div className="font-medium">{p.name} <span className="text-sm text-muted-foreground">({p.idProduct})</span></div>
                  <div className="text-sm text-muted-foreground">Precio: ${p.price} · Stock: {p.stock} · Categoría: {(() => {
                    const found = categories.find(cc => String(cc._id) === String(p.category));
                    return found ? found.name : 'Sin categoría';
                  })()}</div>
                  {p.url ? (
                    <img src={p.url} alt={p.name} className="mt-2 h-20 w-20 object-cover rounded" />
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => startEditProduct(p)}>Editar</Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteProduct(p._id)}>Eliminar</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleCategorySubmit} className="space-y-4 bg-card p-4 rounded">
        <h2 className="text-lg font-semibold">Crear Categoría</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>ID Categoría</Label>
            <Input value={categoryForm.categoryID} onChange={(e) => setCategoryForm({ ...categoryForm, categoryID: e.target.value })} required />
          </div>
          <div>
            <Label>Nombre</Label>
            <Input value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required />
          </div>
        </div>

        <div>
          <Label>Descripción</Label>
          <Textarea value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
        </div>

        <Button type="submit">Crear Categoría</Button>
      </form>

      <div className="bg-card p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Categorías existentes</h2>
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay categorías</p>
        ) : (
          <div className="space-y-2">
            {categories.map((c) => (
              <div key={c._id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <div className="font-medium">{c.name} <span className="text-sm text-muted-foreground">({c.categoryID})</span></div>
                  <div className="text-sm text-muted-foreground">{c.description}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => startEditCategory(c)}>Editar</Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteCategory(c._id)}>Eliminar</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleRoleChange} className="space-y-4 bg-card p-4 rounded">
        <h2 className="text-lg font-semibold">Cambiar Rol de Usuario</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Correo del usuario</Label>
            <Input value={roleForm.email} onChange={(e) => setRoleForm({ ...roleForm, email: e.target.value })} required />
          </div>
          <div>
            <Label>Nuevo rol</Label>
            <Input value={roleForm.role} onChange={(e) => setRoleForm({ ...roleForm, role: e.target.value })} required />
          </div>
        </div>

        <Button type="submit">Actualizar Rol</Button>
      </form>
    </div>
  );
};

export default AdminPanel;