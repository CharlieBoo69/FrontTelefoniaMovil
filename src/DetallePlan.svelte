<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { token, isAuthenticated } from './auth.js';
    import { get } from 'svelte/store';

    export let id;

    let planDetalle = null;

    async function cargarDetallePlan() {
        try {
            const authToken = get(token);
            const res = await fetch(`https://telefoniamovilbackendfinal.azurewebsites.net/api/PlanApi/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (res.ok) {
                planDetalle = await res.json();
            } else {
                console.error('Error al cargar los detalles del plan:', await res.text());
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    }

    onMount(() => {
        if (!get(isAuthenticated)) {
            navigate('/login');
        } else {
            cargarDetallePlan();
        }
    });

    function volverAPlanes() {
        navigate('/');
    }
</script>

<style>
    body {
        font-family: 'Roboto', sans-serif;
        background-color: #f0f4f8;
        margin: 0;
        padding: 0;
    }

    h2 {
        text-align: center;
        color: white;
        background-color: #1f4e78; /* Azul oscuro */
        padding: 20px;
        margin: 0;
        border-radius: 0 0 10px 10px;
        font-size: 24px;
    }

    .detalle-container {
        max-width: 700px;
        margin: 30px auto;
        background: white;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        color: #333;
    }

    .detalle-container p {
        font-size: 16px;
        margin: 10px 0;
        line-height: 1.5;
    }

    .detalle-container p strong {
        color: #555;
    }

    .detalle-container button {
        display: block;
        width: 100%;
        padding: 12px;
        margin-top: 20px;
        background-color: #1f4e78; /* Azul oscuro */
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .detalle-container button:hover {
        background-color: #143d5b; /* Azul más oscuro */
    }

    .loading {
        text-align: center;
        color: #555;
        font-size: 18px;
        margin-top: 50px;
    }
</style>

<h2>Detalle del Plan</h2>

{#if planDetalle}
    <div class="detalle-container">
        <p><strong>Nombre:</strong> {planDetalle.nombre}</p>
        <p><strong>Costo:</strong> {planDetalle.costo} USD</p>
        <p><strong>Datos:</strong> {planDetalle.datos} GB</p>
        <p><strong>Minutos:</strong> {planDetalle.minutos}</p>
        <p><strong>SMS:</strong> {planDetalle.sms}</p>
        <p><strong>Operadora:</strong> {planDetalle.operadora}</p>
        <p><strong>Beneficios Adicionales:</strong> {planDetalle.beneficiosAdicionales}</p>
        <button on:click={volverAPlanes}>Volver a Planes</button>
    </div>
{:else}
    <p class="loading">Cargando detalles del plan...</p>
{/if}
