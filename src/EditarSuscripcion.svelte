<script>
    import { onMount } from 'svelte';
    import { token, isAuthenticated } from './auth.js';
    import { get } from 'svelte/store';
    import { navigate } from 'svelte-routing';

    export let id; // Recibe el ID de la suscripción como parámetro de la URL

    let suscripcion = null;

    // Redirige automáticamente si el usuario no está autenticado
    onMount(() => {
        if (!get(isAuthenticated)) {
            navigate('/login');
        } else {
            cargarSuscripcion();
        }
    });

    // Función para cargar la suscripción por ID
    async function cargarSuscripcion() {
        const authToken = get(token);
        const res = await fetch(`https://telefoniamovilbackend20241106190423.azurewebsites.net/api/Suscripcion/${id}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        if (res.ok) {
            suscripcion = await res.json();
        } else {
            console.error('Error al cargar la suscripción');
        }
    }

    // Función para guardar los cambios en la suscripción
    async function guardarCambios() {
        const authToken = get(token);
        const res = await fetch(`https://telefoniamovilbackend20241106190423.azurewebsites.net/api/Suscripcion/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(suscripcion)
        });

        if (res.ok) {
            console.log('Suscripción actualizada con éxito');
            navigate('/suscripciones');
        } else {
            console.error('Error al actualizar la suscripción');
        }
    }

    // Función para cancelar la edición y regresar a la página de suscripciones
    function cancelar() {
        navigate('/suscripciones');
    }
</script>

<h2>Editar Suscripción</h2>

{#if suscripcion}
    <div>
        <label>Usuario ID:</label>
        <input type="number" bind:value={suscripcion.usuarioId} readonly />
        <label>Plan ID:</label>
        <input type="number" bind:value={suscripcion.planId} />
        <label>Teléfono:</label>
        <input bind:value={suscripcion.numeroTelefono} />
        <button on:click={guardarCambios}>Guardar Cambios</button>
        <button on:click={cancelar}>Cancelar</button>
    </div>
{:else}
    <p>Cargando suscripción...</p>
{/if}
