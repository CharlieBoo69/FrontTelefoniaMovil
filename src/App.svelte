<script>
    import { Router, Route } from 'svelte-routing';
    import { isAuthenticated, userRole } from './auth.js';
    import Login from './Login.svelte';
    import Planes from './Planes.svelte';
    import EditarPlan from './EditarPlan.svelte';
    import CrearPlan from './CrearPlan.svelte';
    import { navigate } from 'svelte-routing';
    import { onMount } from 'svelte';
    import Suscripciones from './Suscripciones.svelte';
    import EditarSuscripcion from './EditarSuscripcion.svelte';
    import CrearSuscripcion from './CrearSuscripcion.svelte';
    import DetallePlan from './DetallePlan.svelte';

    // Redirección en el montaje inicial si no está autenticado
    onMount(() => {
        if (!$isAuthenticated && window.location.pathname !== '/login') {
            navigate('/login');
        }
    });

    // Observa cambios en el estado de autenticación para redirección dinámica
    $: if (!$isAuthenticated && window.location.pathname !== '/login') {
        navigate('/login');
    }
</script>

<Router>
    <!-- Ruta de inicio de sesión -->
    <Route path="/login" component={Login} />

    <!-- Rutas protegidas para el administrador autenticado -->
    {#if $isAuthenticated && $userRole === 'admin'}
        <Route path="/" component={Planes} />
        <Route path="/editar/:id" component={EditarPlan} />
        <Route path="/crear" component={CrearPlan} />
        <Route path="/suscripciones" component={Suscripciones} />
        <Route path="/editar-suscripcion/:id" component={EditarSuscripcion} />
        <Route path="/crear-suscripcion" component={CrearSuscripcion} /> 
        <Route path="/detalle-plan/:id" component={DetallePlan} />




    {/if}

    <!-- Ruta de acceso restringido para el usuario normal (sin permisos de edición/creación) -->
    {#if $isAuthenticated && $userRole === 'user'}
        <Route path="/" component={Planes} />
        <Route path="/detalle-plan/:id" component={DetallePlan} />
    {/if}
</Router>
