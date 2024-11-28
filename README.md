# 📱 Telefonía Móvil Frontend

Este es el frontend del sistema de gestión de planes y suscripciones de telefonía móvil. Permite a los administradores gestionar planes, usuarios y suscripciones, y a los usuarios consultar y suscribirse a planes personalizados según sus preferencias.

---

## 🛠 Tecnologías Utilizadas

- **Framework**: Svelte
- **Librerías**:
  - `svelte-routing` para la gestión de rutas.
- **Lenguaje**: JavaScript
- **Estilos**: CSS (con diseño responsivo)

---

## 🚀 Características

### Funcionalidades Principales:

1. **Gestión de Usuarios** (Solo Admin):
   - Crear nuevos usuarios desde el panel administrativo.

2. **Gestión de Planes** (Solo Admin):
   - Crear, editar y eliminar planes.
   - Listar y filtrar planes por operadora.

3. **Gestión de Suscripciones** (Solo Admin):
   - Consultar todas las suscripciones realizadas por los usuarios.
   - Generar reportes avanzados sobre usuarios con múltiples suscripciones.

4. **Panel de Usuario**:
   - Listar todos los planes disponibles.
   - Suscribirse a un plan seleccionando un número de teléfono.
   - Consultar las suscripciones activas.
   - Recibir recomendaciones personalizadas basadas en preferencias.

---

## 🌐 Estructura del Proyecto

```plaintext
├── src
│   ├── auth.js            # Gestión de autenticación y estado global
│   ├── App.svelte         # Componente principal y enrutamiento
│   ├── components         # Componentes reutilizables
│   │   ├── Header.svelte  # Encabezado del sistema
│   │   └── Footer.svelte  # Pie de página
│   ├── pages              # Vistas principales
│   │   ├── Login.svelte   # Página de inicio de sesión
│   │   ├── Planes.svelte  # Gestión de planes (admin y usuario)
│   │   ├── CrearPlan.svelte # Creación de planes
│   │   ├── EditarPlan.svelte # Edición de planes
│   │   ├── Suscripciones.svelte # Gestión de suscripciones (admin)
│   │   ├── MisSuscripciones.svelte # Gestión de suscripciones (usuario)
│   │   └── ReporteUsuarios.svelte # Reporte avanzado de usuarios (admin)
│   └── styles.css         # Estilos globales
├── public
│   └── index.html         # Archivo principal HTML
├── package.json           # Dependencias y scripts del proyecto
└── README.md              # Este archivo
```
## 🌐 Enrutamiento

- **Ruta `/login`**: Página de inicio de sesión.
- **Ruta `/planes`**: Página principal para listar planes disponibles.
- **Ruta `/crear-plan`**: Formulario para crear nuevos planes (solo admin).
- **Ruta `/editar-plan/:id`**: Formulario para editar un plan existente (solo admin).
- **Ruta `/suscripciones`**: Gestión de suscripciones y reportes avanzados (solo admin).
- **Ruta `/mis-suscripciones`**: Vista de suscripciones activas del usuario autenticado.
- **Ruta `/reporte-usuarios`**: Reporte de usuarios con múltiples suscripciones (admin).

## ⚙️ Configuración

### Dependencias
Antes de iniciar el proyecto, asegúrate de instalar las dependencias necesarias ejecutando:
```bash
npm install
```
### Variables de Entorno
Configura un archivo .env en la raíz del proyecto con las siguientes variables:
```
VITE_API_BASE_URL=http://localhost:5181/api
```
### Iniciar el Servidor de Desarrollo
Para iniciar el servidor de desarrollo:
```
npm run dev
```
### El proyecto estará disponible en 
```
http://localhost:8080
```
