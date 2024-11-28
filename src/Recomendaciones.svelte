<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { isAuthenticated } from './auth.js';
    import { get } from 'svelte/store';

    let preferencias = {
        costo: '',
        datos: '',
        minutos: '',
        sms: '',
        operadora: '',
        pesoCosto: 2,
        pesoDatos: 4,
        pesoMinutos: 3,
        pesoSMS: 1,
    };

    let planes = [];
    let operadoras = [];
    let recomendaciones = [];
    let error = '';
    let numeroTelefono = ''; // Ntelf ingresado por el usuario
    let planSeleccionado = null; // ID del plan seleccionado para suscribirse

    onMount(() => {
        if (!get(isAuthenticated)) {
            navigate('/login');
        } else {
            cargarPlanesYOperadoras();
        }
    });

    async function cargarPlanesYOperadoras() {
        try {
            const res = await fetch('http://localhost:5181/api/PlanApi', {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (res.ok) {
                planes = await res.json();
                const operadorasSet = new Set(planes.map(plan => plan.operadora));
                operadoras = ['Todas las Operadoras', ...operadorasSet];
            } else {
                console.error('Error al cargar planes:', res.status, res.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud de planes:', error);
        }
    }

    async function obtenerRecomendaciones() {
        error = '';
        planSeleccionado = null; // Limpiar selección previa
        numeroTelefono = ''; // Limpiar campo de teléfono
        try {
            const res = await fetch('http://localhost:5181/api/PlanApi/GetRecommendedPlans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(preferencias),
            });

            if (res.ok) {
                recomendaciones = await res.json();
            } else {
                const errorResponse = await res.json();
                error = errorResponse.message || 'Ocurrió un error al obtener las recomendaciones.';
            }
        } catch (err) {
            console.error('Error al obtener las recomendaciones:', err);
            error = 'No se pudo conectar con el servidor.';
        }
    }

    async function suscribirse(planId) {
        if (!numeroTelefono.trim()) {
            alert('Por favor, ingresa un número de teléfono para suscribirte.');
            return;
        }

        try {
            const res = await fetch('http://localhost:5181/api/Suscripcion/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ planId, numeroTelefono }),
            });

            if (res.ok) {
                alert('¡Suscripción exitosa!');
                planSeleccionado = null; // Limpiar selección después de suscribirse
                numeroTelefono = ''; // Limpiar número de teléfono
            } else if (res.status === 400) {
                const errorResponse = await res.json();
                alert(errorResponse.message || 'Error al suscribirse.');
            } else {
                alert('Error desconocido al suscribirse.');
            }
        } catch (err) {
            console.error('Error al suscribirse:', err);
            alert('No se pudo conectar con el servidor.');
        }
    }

    function seleccionarPlan(planId) {
        planSeleccionado = planId; // Seleccionar el plan al que el usuario quiere suscribirse
    }

    function cancelarSuscripcion() {
        planSeleccionado = null; // Limpiar selección
        numeroTelefono = ''; // Limpiar campo de teléfono
    }

    function volverAPlanes() {
        navigate('/');
    }
</script>

<style>
    
    h1 {
        text-align: center;
        color: #333;
        margin-bottom: 20px;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 15px;
        max-width: 600px;
        margin: 0 auto;
        background: #f9f9f9;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    label {
        font-weight: bold;
        color: #555;
    }

    input,
    select {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        width: 100%;
    }

    input:focus,
    select:focus {
        border-color: #1f4e78;
        outline: none;
    }

    .recomendaciones {
        margin: 20px auto;
        max-width: 900px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
    }

    .plan {
        background: white;
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .plan p {
        margin: 5px 0;
        color: #333;
    }

    .plan strong {
        font-weight: bold;
    }

    .error {
        color: red;
        text-align: center;
        font-weight: bold;
        margin: 10px 0;
    }
</style>

<h1>Recomendaciones Personalizadas</h1>

<form on:submit|preventDefault={obtenerRecomendaciones}>
    <label for="costo">Presupuesto máximo (USD):</label>
    <input type="number" id="costo" bind:value={preferencias.costo} />

    <label for="datos">Datos móviles requeridos (GB):</label>
    <input type="number" id="datos" bind:value={preferencias.datos} />

    <label for="minutos">Minutos requeridos:</label>
    <input type="number" id="minutos" bind:value={preferencias.minutos} />

    <label for="sms">Cantidad de SMS requeridos:</label>
    <input type="number" id="sms" bind:value={preferencias.sms} />

    <label for="operadora">Operadora preferida:</label>
    <select id="operadora" bind:value={preferencias.operadora}>
        {#each operadoras as operadora}
            <option value={operadora}>{operadora}</option>
        {/each}
    </select>

    <label for="pesos">Pesos de preferencia:</label>
    <div style="display: flex; gap: 10px;">
        <input type="number" placeholder="Costo" bind:value={preferencias.pesoCosto} />
        <input type="number" placeholder="Datos" bind:value={preferencias.pesoDatos} />
        <input type="number" placeholder="Minutos" bind:value={preferencias.pesoMinutos} />
        <input type="number" placeholder="SMS" bind:value={preferencias.pesoSMS} />
    </div>

    <button>Obtener Recomendaciones</button>
</form>

<div class="recomendaciones">
    {#if error}
        <p class="error">{error}</p>
    {/if}

    {#each recomendaciones as rec}
        <div class="plan">
            <p><strong>Plan:</strong> {rec.plan.nombre}</p>
            <p><strong>Costo:</strong> {rec.plan.costo} USD</p>
            <p><strong>Datos:</strong> {rec.plan.datos} GB</p>
            <p><strong>Minutos:</strong> {rec.plan.minutos}</p>
            <p><strong>SMS:</strong> {rec.plan.sms}</p>
            <p><strong>Operadora:</strong> {rec.plan.operadora}</p>
            <p><strong>Beneficios Adicionales:</strong> {rec.plan.beneficiosAdicionales}</p>
            <p><strong>Hybrid Score:</strong> {rec.hybridScore.toFixed(2)}</p>
            <p><strong>Similitud:</strong> {rec.similarityPercentage.toFixed(2)}%</p>

            {#if planSeleccionado === rec.plan.id}
                <input type="text" placeholder="Ingresa tu número de teléfono" bind:value={numeroTelefono} /> 
                <button on:click={() => suscribirse(rec.plan.id)}>Confirmar Suscripción</button>
                <button on:click={cancelarSuscripcion}>Cancelar</button>
            {:else}
                <button on:click={() => seleccionarPlan(rec.plan.id)}>Suscribirse</button>
            {/if}
        </div>
    {/each}
</div>

<button on:click={volverAPlanes}>Volver a Planes</button>
