# Probar las APIs (Postman)

Este documento explica cómo levantar el backend y probar todas las rutas REST con Postman (o cURL). Está en español y contiene ejemplos de JSON para los endpoints principales.

Base URL

- Local: `http://localhost:3000/barroco`

Autenticación

- El backend soporta ahora autenticación por Bearer token (JWT). Conserva la compatibilidad con Basic Auth.

- Variables de entorno relacionadas:
  - `BASIC_USER` — usuario administrador (usado para comprobar credenciales al emitir token)
  - `BASIC_PASS` — contraseña administrador
  - `JWT_SECRET` — secreto para firmar/verificar tokens JWT (pon una cadena segura)

- Flujo para obtener y usar el token:
  1. Obtener token: POST `http://localhost:3000/auth/login` con body JSON:

     ```json
     { "username": "admin", "password": "secreto" }
     ```

     Respuesta: `{ "token": "<JWT>" }`.

  2. Usar el token en Postman: en la request, pestaña `Authorization` → Type `Bearer Token` → pega el token, o añade header manual:
     - Header: `Authorization`
     - Value: `Bearer <JWT>`

  3. El middleware acepta tanto `Authorization: Bearer <JWT>` como `Authorization: Basic <BASE64>` (si lo prefieres).

Requisitos antes de probar

- Tener el backend corriendo (ver más abajo).
- MongoDB accesible y `MONGODB_URI` en `Backend/.env` apuntando a la base de datos.

Cómo levantar el backend (rápido)

```bash
cd Backend
npm install
# crea .env con las variables (ejemplo abajo)
node app.js
# o con nodemon (recomendado para desarrollo):
# npx nodemon app.js
```

Ejemplo mínimo de `Backend/.env`:

```
MONGODB_URI=mongodb://localhost:27017/barroco
BASIC_USER=admin
BASIC_PASS=secreto
PORT=3000
```

Endpoints principales y ejemplos JSON

Nota: la ruta base para cada recurso es `/barroco` → p. ej. `http://localhost:3000/barroco/products`.

- Productos
  - GET /barroco/products
    - Lista todos los productos.

  - GET /barroco/productsAvailable
    - Lista productos disponibles (según lógica interna).

  - GET /barroco/productsDiscounted
    - Lista productos con descuentos (si aplica).

  - GET /barroco/products/:id
    - Obtener producto por id (mongoose \_id usado en rutas de controlador).

  - POST /barroco/products
    - Crear un producto. Body (JSON):

    ```json
    {
      "idProduct": "p123",
      "name": "Guitarra acústica",
      "description": "Guitarra de cedro",
      "price": 1200,
      "stock": 5,
      "category": "<ObjectId categoría o null>",
      "custom": false,
      "url": "https://ejemplo.com/guitarra.jpg"
    }
    ```

  - PUT /barroco/products/:id
    - Actualizar campos del producto (envía sólo los campos a cambiar).

  - DELETE /barroco/products/:id
    - Eliminar producto.

  - POST /barroco/products/:idProduct/purchase
    - Comprar una cantidad del producto. Body:

    ```json
    { "quantity": 2 }
    ```

- Categorías
  - GET /barroco/categories
  - GET /barroco/categories/:id
  - POST /barroco/categories
    - Crear categoría. Body ejemplo:

    ```json
    {
      "categoryID": 10,
      "name": "Instrumentos",
      "description": "Instrumentos musicales"
    }
    ```

  - PUT /barroco/categories/:id
  - DELETE /barroco/categories/:id

- Customers (clientes)
  - GET /barroco/customers
  - GET /barroco/customers/:id
  - GET /barroco/customers/check-admin
    - Comprueba si existe un admin en la colección.
  - PUT /barroco/customers/update-role
    - Cambiar rol por email. Body ejemplo:

    ```json
    { "email": "usuario@ejemplo.com", "role": "admin" }
    ```

  - POST /barroco/customers
    - Crear cliente. Body mínimo requerido por el modelo:

    ```json
    {
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan@example.com",
      "password": "miPassword",
      "phone": "123456789",
      "billingAddress": "Calle Falsa 123"
    }
    ```

  - PUT /barroco/customers/:id
  - DELETE /barroco/customers/:id

- Shopping Cart (carrito)
  - POST /barroco/shoppingCart
    - Crear carrito. Ejemplo body:

    ```json
    {
      "customer": "juan@example.com",
      "products": [{ "idProduct": "p123", "quantity": 2, "price": 1200 }],
      "total": 2400
    }
    ```

  - GET /barroco/shoppingCart
  - GET /barroco/shoppingCart/:id
  - GET /barroco/shoppingCart/customer/:customerId
    - Recupera carrito por `customer` (aquí el controller usa `customerId` como parámetro — normalmente es el email en este proyecto).

  - PUT /barroco/shoppingCart/:id
    - Actualiza carrito (envía la estructura completa o campos a modificar).

  - DELETE /barroco/shoppingCart/:id

Ejemplos rápidos con cURL

# Listar productos

```bash
curl -u admin:secreto http://localhost:3000/barroco/products
```

# Crear cliente

```bash
curl -X POST -u admin:secreto -H "Content-Type: application/json" \
  -d '{"firstName":"Ana","lastName":"Lopez","email":"ana@ejemplo.com","password":"12345","phone":"999","billingAddress":"C/1"}' \
  http://localhost:3000/barroco/customers
```

Notas y recomendaciones

- Si recibes 401: revisa que `BASIC_USER`/`BASIC_PASS` en `Backend/.env` coincidan con lo que usas en Postman.
- Asegúrate que MongoDB está accesible y la colección exista o el backend podrá crear documentos al insertar.
- Para pruebas rápidas puedes usar `localhost` y los valores del ejemplo.

¿Quieres que genere una colección de Postman (archivo JSON) con estas peticiones ya configuradas? Puedo crearla y añadirla al repositorio si quieres.
