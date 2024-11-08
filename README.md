# README del Frontend

## Descripción del Proyecto
El frontend de este proyecto está desarrollado utilizando **Svelte** para crear una interfaz responsiva y fácil de usar para la gestión de suscripciones de planes de telefonía móvil. Esta interfaz se comunica de manera eficiente con la API backend alojada en Azure, proporcionando funcionalidades completas de CRUD y autenticación de usuarios.

## Tecnologías Utilizadas
- **Framework**: Svelte
- **Enrutamiento**: `svelte-routing`
- **Gestión de Estado**: Stores de Svelte
- **IDE**: Visual Studio Code
- **Alojamiento**: Netlify
- **Control de Versiones**: Git (GitHub)

## Estructura del Proyecto
El proyecto está organizado de la siguiente manera:

- **src/components**: Contiene componentes de UI reutilizables, como `Login.svelte`, `PlanList.svelte` y `CreatePlan.svelte`.
- **src/pages**: Componentes de las páginas principales como `Index.svelte` (página de inicio de sesión) y `InicioAdmin.svelte` (panel de administración).
- **src/stores**: Gestión centralizada del estado, incluyendo la autenticación de usuarios y datos de sesión.
- **public**: Archivos estáticos y recursos.

## Características Principales
- **Autenticación de Usuarios**: Sistema de inicio de sesión integrado con autenticación JWT del backend.
- **Gestión de Planes**: Los administradores pueden crear, ver, editar y eliminar planes de telefonía móvil.
- **Gestión de Suscripciones**: Los usuarios pueden navegar por los planes disponibles y gestionar sus propias suscripciones.
- **Navegación Basada en Roles**: Garantiza que las funcionalidades específicas para administradores solo sean accesibles para usuarios con los permisos adecuados.

## Instalación y Configuración
Para ejecutar el proyecto localmente, siga estos pasos:

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/yourusername/your-repo.git
   ```

2. **Navegar al directorio del proyecto**:
   ```bash
   cd your-repo
   ```

3. **Instalar las dependencias**:
   ```bash
   npm install
   ```

4. **Ejecutar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

5. **Acceder al frontend** en:
   ```
   http://localhost:5173
   ```

## Despliegue
El frontend está desplegado en **Netlify**, lo que facilita la integración con GitHub para un despliegue continuo. Cualquier cambio en la rama principal desencadena un despliegue automático. El resultado de la compilación se almacena en el directorio `public`, que es servido por Netlify.

### Pasos para el Despliegue:
1. **Conectar el repositorio a Netlify**.
2. **Configurar el comando de construcción**:
   ```bash
   npm run build
   ```
3. **Especificar el directorio de publicación**:
   ```
   public
   ```

## Buenas Prácticas Implementadas
- **Componentes Modulares**: La UI está dividida en componentes pequeños y reutilizables para mejorar la mantenibilidad.
- **Gestión de Estado**: Uso de stores de Svelte para la gestión de estado global, facilitando el intercambio de datos entre componentes.
- **Enrutamiento**: Uso de `svelte-routing` para la navegación en el cliente.
- **Variables de Entorno**: La gestión de datos sensibles, como las claves API, se realiza a través de variables de entorno.

## Mejoras Futuras
- **Mejoras de Diseño Responsivo**: Agregar más estilos para dispositivos móviles y tabletas.
- **UI/UX Mejorada**: Implementar elementos interactivos y animaciones.
- **Localización**: Soporte multilingüe para un alcance más amplio de usuarios.
- **Panel de Análisis**: Un panel para mostrar métricas de usuarios y planes populares.

## Contacto y Soporte
Para cualquier problema o consulta, por favor contacte:
- **Nombre**: Carlos Esteban Larco
- **Correo Electrónico**: carlos.larco.escobar@udla.edu.ec

