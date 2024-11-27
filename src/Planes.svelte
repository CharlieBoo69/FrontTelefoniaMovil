<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { isAuthenticated, userRole, token, logout } from './auth.js';
    import { get } from 'svelte/store';

    let planes = [];
    let operadoras = [];
    let operadoraSeleccionada = "Todas las Operadoras";
    let numeroTelefono = '';
    let planSeleccionado = null;
    let errorSuscripcion = '';

    onMount(() => {
        if (!get(isAuthenticated)) {
            navigate('/login');
        } else {
            cargarOperadorasYPlanes();
        }
    });

    async function cargarOperadorasYPlanes() {
        try {
            const res = await fetch('https://telefoniamovilbackendfinal.azurewebsites.net/api/PlanApi', {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            if (res.ok) {
                planes = await res.json();
                obtenerOperadorasUnicas();
                filtrarPlanes();
            } else {
                console.error('Error al cargar los planes:', res.status, res.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud de carga de planes:', error);
        }
    }

    function obtenerOperadorasUnicas() {
        const operadorasSet = new Set(planes.map(plan => plan.operadora));
        operadoras = ["Todas las Operadoras", ...operadorasSet];
    }

    async function filtrarPlanes() {
        try {
            let url = 'https://telefoniamovilbackendfinal.azurewebsites.net/api/PlanApi';
            if (operadoraSeleccionada !== "Todas las Operadoras") {
                url += `/ByOperadora/${encodeURIComponent(operadoraSeleccionada)}`;
            }

            const res = await fetch(url, {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (res.ok) {
                planes = await res.json();
            } else {
                console.error('Error al cargar los planes filtrados:', res.status, res.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud de carga de planes filtrados:', error);
        }
    }


    async function crearSuscripcion(planId) {
    errorSuscripcion = ''; // Limpiar errores previos

    if (!numeroTelefono.trim()) {
        errorSuscripcion = 'Por favor, ingresa un número de teléfono.';
        return;
    }

    const confirmacion = confirm('¿Estás seguro de que deseas suscribirte a este plan?');
    if (!confirmacion) return;

    // Verifica los datos que estás enviando
    console.log('Datos enviados:', { planId, numeroTelefono });

    try {
        const res = await fetch('https://telefoniamovilbackendfinal.azurewebsites.net/api/Suscripcion/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ planId, numeroTelefono }),
        });

        if (res.ok) {
            const mensajeExito = await res.text();
            console.log(mensajeExito);
            alert(mensajeExito);
            errorSuscripcion = '';
            numeroTelefono = '';
            planSeleccionado = null;
        } else {
            const mensajeError = await res.text();
            console.error('Error del servidor:', mensajeError);
            errorSuscripcion = mensajeError || 'Ocurrió un error al intentar suscribirse.';
        }
    } catch (error) {
        console.error('Error en la solicitud de suscripción:', error);
        errorSuscripcion = 'No se pudo conectar con el servidor.';
    }
}


    async function eliminarPlan(id) {
        const confirmacion = confirm('¿Estás seguro de que deseas eliminar este plan?');
        if (confirmacion) {
            try {
                const authToken = get(token);
                const res = await fetch(`https://telefoniamovilbackendfinal.azurewebsites.net/api/PlanApi/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                if (res.ok) {
                    planes = planes.filter(plan => plan.id !== id);
                } else {
                    console.error('Error al eliminar el plan:', res.status, res.statusText);
                }
            } catch (error) {
                console.error('Error en la solicitud de eliminación de plan:', error);
            }
        }
    }

    function irARecomendaciones() {
    navigate('/recomendaciones');
}

    function handleLogout() {
        logout();
        navigate('/login');
    }

    function editarPlan(id) {
        navigate(`/editar/${id}`);
    }

    function crearNuevoPlan() {
        navigate('/crear');
    }

    function verDetallePlan(id) {
        navigate(`/detalle-plan/${id}`);
    }
</script>

<style>
    body {
        font-family: 'Roboto', sans-serif;
        background-color: #f0f4f8;
        margin: 0;
        padding: 0;
    }

    h1 {
        text-align: center;
        color: white;
        background-color: #1f4e78; /* Azul oscuro */
        padding: 20px;
        margin: 0;
        border-radius: 0 0 10px 10px;
        font-size: 24px;
        letter-spacing: 1px;
    }

    .buttons {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin: 20px 0;
    }

    button {
        padding: 10px 20px;
        font-size: 14px;
        border: none;
        border-radius: 5px;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
    }

    button.green {
        background-color: #388e3c; /* Verde */
    }

    button.green:hover {
        background-color: #2e7d32;
    }

    button.blue {
        background-color: #1f4e78; /* Azul oscuro */
    }

    button.blue:hover {
        background-color: #143d5b;
    }

    button.red {
        background-color: #d32f2f; /* Rojo */
    }

    button.red:hover {
        background-color: #b71c1c;
    }

    .operadora-filter {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 20px 0;
        gap: 10px;
    }

    select {
        padding: 10px;
        font-size: 14px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    ul {
        list-style: none;
        margin: 0 auto;
        padding: 0;
        max-width: 900px;
    }

    li {
        background: white;
        margin: 15px 0;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    li p {
        margin: 0 0 10px 0;
        color: #333;
    }

    .plan-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .error {
        color: #d32f2f;
        text-align: center;
        font-weight: bold;
        margin-top: 10px;
    }

    input[type="text"] {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        width: calc(100% - 20px);
    }

    input[type="text"]:focus {
        border-color: #1f4e78;
        outline: none;
    }
</style>

<h1>Planes de Telefonía</h1>

<div class="buttons">
    <button class="blue" on:click={handleLogout}>Cerrar Sesión</button>
    {#if $userRole === 'admin'}
        <button class="green" on:click={crearNuevoPlan}>Crear Nuevo Plan</button>
        <button class="blue" on:click={() => navigate('/suscripciones')}>Gestionar Suscripciones</button>
    {/if}
    {#if $userRole === 'user'}
        <button class="blue" on:click={() => navigate('/mis-suscripciones')}>Ver Mis Suscripciones</button>
        <button class="green" on:click={irARecomendaciones}>Ir a Recomendaciones</button>
        {/if}
</div>

<div class="operadora-filter">
    <select bind:value={operadoraSeleccionada} on:change={filtrarPlanes}>
        {#each operadoras as operadora}
            <option>{operadora}</option>
        {/each}
    </select>
</div>

<ul>
    {#each planes as plan (plan.id)}
        <li>
            <p><strong>{plan.nombre}</strong> - {plan.costo} USD - {plan.operadora}</p>
            <div class="plan-actions">
                <button class="blue" on:click={() => verDetallePlan(plan.id)}>Ver Detalles</button>
                {#if $userRole === 'admin'}
                    <button class="green" on:click={() => editarPlan(plan.id)}>Editar</button>
                    <button class="red" on:click={() => eliminarPlan(plan.id)}>Eliminar</button>
                {/if}
                {#if $userRole === 'user'}
                    {#if planSeleccionado === plan.id}
                        <input type="text" placeholder="Número de teléfono" bind:value={numeroTelefono} />
                        <button class="green" on:click={() => crearSuscripcion(plan.id)}>Confirmar</button>
                        <button class="red" on:click={() => planSeleccionado = null}>Cancelar</button>
                    {:else}
                        <button class="blue" on:click={() => planSeleccionado = plan.id}>Suscribirse</button>
                    {/if}
                {/if}
            </div>
        </li>
    {/each}
</ul>

{#if errorSuscripcion}
    <p class="error">{errorSuscripcion}</p>
{/if}
