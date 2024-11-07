<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { token, isAuthenticated } from './auth.js';
    import { get } from 'svelte/store';

    export let id; // Recibe el id del plan como parámetro

    let planDetalle = null;

    // Función para cargar los detalles del plan por ID con autenticación
    async function cargarDetallePlan() {
        const authToken = get(token);
        const res = await fetch(`https://telefoniamovilbackend20241106190423.azurewebsites.net/api/PlanApi/${id}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        if (res.ok) {
            planDetalle = await res.json();
        } else {
            console.error('Error al cargar los detalles del plan');
        }
    }

    // Redirige si no está autenticado y carga el detalle del plan si lo está
    onMount(() => {
        if (!get(isAuthenticated)) {
            navigate('/login');
        } else {
            cargarDetallePlan();
        }
    });

    // Función para volver a la página de planes
    function volverAPlanes() {
        navigate('/');
    }
</script>

<h2>Detalle del Plan</h2>

{#if planDetalle}
    <div>
        <p><strong>Nombre:</strong> {planDetalle.nombre}</p>
        <p><strong>Costo:</strong> {planDetalle.costo} USD</p>
        <p><strong>Datos:</strong> {planDetalle.datos} GB</p>
        <p><strong>Minutos:</strong> {planDetalle.minutos}</p>
        <p><strong>SMS:</strong> {planDetalle.sms}</p>
        <p><strong>Operadora:</strong> {planDetalle.operadora}</p>
        <p><strong>Beneficios Adicionales:</strong> {planDetalle.beneficiosAdicionales}</p>
    </div>
    <button on:click={volverAPlanes}>Volver a Planes</button>
{:else}
    <p>Cargando detalles del plan...</p>
{/if}
