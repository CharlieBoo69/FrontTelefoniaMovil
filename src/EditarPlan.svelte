<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { token, isAuthenticated } from './auth.js';
    import { get } from 'svelte/store';

    export let id; // Recibe el id del plan como parámetro de la URL

    let planEdicion = null;

    // Función para cargar el plan por ID con autenticación
    async function cargarPlan() {
        const authToken = get(token); // Obtiene el token actual
        const res = await fetch(`https://telefoniamovilbackend20241106190423.azurewebsites.net/api/PlanApi/${id}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`, // Añade el token JWT al encabezado
                'Content-Type': 'application/json'
            }
        });
        if (res.ok) {
            planEdicion = await res.json();
        } else {
            console.error('Error al cargar el plan');
        }
    }

    // Función para guardar los cambios del plan editado con autenticación
    async function guardarCambios() {
        const authToken = get(token);
        const res = await fetch(`https://telefoniamovilbackend20241106190423.azurewebsites.net/api/PlanApi/${planEdicion.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`, // Añade el token JWT al encabezado
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(planEdicion),
        });

        if (res.ok) {
            console.log('Plan actualizado con éxito');
            navigate('/'); // Redirige a la página principal después de guardar los cambios
        } else {
            console.error('Error al actualizar el plan');
        }
    }

    // Función para cancelar la edición y regresar a la página principal
    function cancelarEdicion() {
        navigate('/'); // Redirige a la página principal
    }

    // Redirige automáticamente si el usuario no está autenticado
    onMount(() => {
        if (!get(isAuthenticated)) {
            navigate('/login'); // Redirige a la página de inicio de sesión si no está autenticado
        } else {
            cargarPlan(); // Carga el plan si está autenticado
        }
    });
</script>

<h2>Editar Plan</h2>

{#if planEdicion}
    <div>
        <label>Nombre del plan:</label>
        <input bind:value={planEdicion.nombre} />
        <label>Costo (USD):</label>
        <input type="number" bind:value={planEdicion.costo} />
        <label>Datos (GB):</label>
        <input type="number" bind:value={planEdicion.datos} />
        <label>Minutos:</label>
        <input type="number" bind:value={planEdicion.minutos} />
        <label>SMS:</label>
        <input type="number" bind:value={planEdicion.sms} />
        <label>Operadora:</label>
        <input bind:value={planEdicion.operadora} />
        <label>Beneficios Adicionales:</label>
        <input bind:value={planEdicion.beneficiosAdicionales} />
        <button on:click={guardarCambios}>Guardar cambios</button>
        <button on:click={cancelarEdicion}>Cancelar</button>
    </div>
{:else}
    <p>Cargando plan...</p>
{/if}
