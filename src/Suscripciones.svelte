<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { token, isAuthenticated } from './auth.js';
    import { get } from 'svelte/store';

    let suscripcionesPopulares = [];
    let suscripciones = [];
    let planIdFiltro = ''; // Variable para el filtro por Plan ID
    let suscripcionesFiltradas = [];

    // Redirige automáticamente si el usuario no está autenticado
    onMount(() => {
        if (!get(isAuthenticated)) {
            navigate('/login');
        } else {
            cargarSuscripcionesPopulares();
            cargarTodasLasSuscripciones();
        }
    });

    // Función para cargar las suscripciones más populares desde el backend
    async function cargarSuscripcionesPopulares() {
        const authToken = get(token);
        const res = await fetch('https://telefoniamovilbackend20241106190423.azurewebsites.net/api/Suscripcion/TopPlanes', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        if (res.ok) {
            suscripcionesPopulares = await res.json();
        } else {
            console.error('Error al cargar las suscripciones más populares');
        }
    }

    // Función para cargar todas las suscripciones desde el backend
    async function cargarTodasLasSuscripciones() {
        const authToken = get(token);
        const res = await fetch('https://telefoniamovilbackend20241106190423.azurewebsites.net/api/Suscripcion', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        if (res.ok) {
            suscripciones = await res.json();
            suscripcionesFiltradas = suscripciones; // Inicialmente muestra todas
        } else {
            console.error('Error al cargar todas las suscripciones');
        }
    }

    // Función para eliminar una suscripción
    async function eliminarSuscripcion(id) {
        const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta suscripción?');
        if (confirmacion) {
            const authToken = get(token);
            const res = await fetch(`https://telefoniamovilbackend20241106190423.azurewebsites.net/api/Suscripcion/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            if (res.ok) {
                suscripciones = suscripciones.filter(s => s.id !== id);
                suscripcionesFiltradas = suscripciones.filter(s => s.id !== id); // Actualiza el filtro
                console.log('Suscripción eliminada con éxito');
            } else {
                console.error('Error al eliminar la suscripción');
            }
        }
    }

    // Función para redirigir a la página de edición de suscripción
    function editarSuscripcion(id) {
        navigate(`/editar-suscripcion/${id}`);
    }

    // Función para redirigir a la página de creación de suscripción
    function crearNuevaSuscripcion() {
        navigate('/crear-suscripcion');
    }

    // Función para regresar a la página principal
    function volverAPaginaPrincipal() {
        navigate('/');
    }

    // Función para filtrar las suscripciones por Plan ID
    function filtrarSuscripcionesPorPlan() {
        if (planIdFiltro.trim() === '') {
            suscripcionesFiltradas = suscripciones; // Si el filtro está vacío, muestra todas
        } else {
            suscripcionesFiltradas = suscripciones.filter(
                s => s.planId.toString() === planIdFiltro
            );
        }
    }
</script>

<h1>Suscripciones</h1>

<button on:click={volverAPaginaPrincipal}>Volver a la Página Principal</button>
<button on:click={crearNuevaSuscripcion}>Crear Nueva Suscripción</button>

<h2>Suscripciones Más Populares</h2>
<ul>
    {#each suscripcionesPopulares as popular}
        <li>Plan ID: {popular.planId} - Total Suscripciones: {popular.totalSuscripciones}</li>
    {/each}
</ul>

<h2>Todas las Suscripciones</h2>

<div>
    <label for="planIdFiltro">Filtrar por Plan ID:</label>
    <input id="planIdFiltro" type="text" bind:value={planIdFiltro} />
    <button on:click={filtrarSuscripcionesPorPlan}>Buscar</button>
</div>

<ul>
    {#each suscripcionesFiltradas as suscripcion}
        <li>
            Usuario ID: {suscripcion.usuarioId}, Plan ID: {suscripcion.planId}, Número de Teléfono: {suscripcion.numeroTelefono}, Fecha: {new Date(suscripcion.fechaSuscripcion).toLocaleDateString()}
            <button on:click={() => editarSuscripcion(suscripcion.id)}>Editar</button>
            <button on:click={() => eliminarSuscripcion(suscripcion.id)}>Eliminar</button>
        </li>
    {/each}
</ul>
