<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { isAuthenticated, token } from './auth.js';
    import { get } from 'svelte/store';

    let suscripciones = [];
    let suscripcionesFiltradas = [];
    let numeroTelefonoFiltro = '';
    let error = '';
    let confirmacionId = null;

    onMount(() => {
        if (!get(isAuthenticated)) {
            navigate('/login');
        } else {
            cargarSuscripciones();
        }
    });

    async function cargarSuscripciones() {
        try {
            const authToken = get(token);
            const response = await fetch('http://localhost:5181/api/Suscripcion/User', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                suscripciones = await response.json();
                suscripcionesFiltradas = suscripciones;
            } else {
                error = 'Ocurrió un error al cargar tus suscripciones.';
            }
        } catch (err) {
            console.error('Error al cargar suscripciones:', err);
            error = 'Ocurrió un error al cargar tus suscripciones.';
        }
    }

    function confirmarDesuscripcion(id) {
        confirmacionId = id;
    }

    function cancelarConfirmacion() {
        confirmacionId = null;
    }

    async function desuscribirse(id) {
        try {
            const authToken = get(token);
            const response = await fetch(`http://localhost:5181/api/Suscripcion/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                suscripciones = suscripciones.filter(s => s.id !== id);
                suscripcionesFiltradas = suscripciones;
                confirmacionId = null;
            } else {
                error = 'Ocurrió un error al eliminar la suscripción.';
            }
        } catch (err) {
            console.error('Error al eliminar la suscripción:', err);
            error = 'Ocurrió un error al eliminar la suscripción.';
        }
    }

    function volverAPaginaPrincipal() {
        navigate('/');
    }

    function filtrarPorNumeroTelefono() {
        if (numeroTelefonoFiltro.trim() === '') {
            suscripcionesFiltradas = suscripciones;
            error = '';
        } else {
            suscripcionesFiltradas = suscripciones.filter(suscripcion =>
                suscripcion.numeroTelefono.includes(numeroTelefonoFiltro)
            );

            if (suscripcionesFiltradas.length === 0) {
                error = 'No se encontraron suscripciones con este número de teléfono.';
            } else {
                error = '';
            }
        }
    }
</script>

<style>
    body {
        font-family: 'Arial', sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 0;
    }

    h1 {
        text-align: center;
        background-color: #1f4e78;
        color: white;
        padding: 15px;
        margin: 0;
        border-radius: 0 0 10px 10px;
        font-size: 24px;
    }

    .container {
        max-width: 800px;
        margin: 20px auto;
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .filter-container {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
    }

    input {
        flex: 1;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 14px;
    }

    button {
        padding: 10px 15px;
        font-size: 14px;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .btn-blue {
        background-color: #1f4e78;
    }

    .btn-blue:hover {
        background-color: #143d5b;
    }

    .btn-red {
        background-color: #d32f2f;
    }

    .btn-red:hover {
        background-color: #b71c1c;
    }

    .btn-green {
        background-color: #388e3c;
    }

    .btn-green:hover {
        background-color: #2e7d32;
    }

    .btn-back {
        display: block;
        margin: 10px auto 20px auto;
        background-color: #4CAF50;
        padding: 10px 20px;
        font-size: 16px;
        text-align: center;
    }

    ul {
        list-style: none;
        padding: 0;
    }

    li {
        background: #f9f9f9;
        padding: 15px;
        margin-bottom: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .error-message {
        color: red;
        font-size: 14px;
        margin-top: 10px;
        text-align: center;
    }

    .no-suscriptions {
        text-align: center;
        font-size: 16px;
        color: #555;
    }
</style>

<h1>Mis Suscripciones</h1>

<div class="container">
    <button class="btn-back" on:click={volverAPaginaPrincipal}>Volver a la Página Principal</button>

    <div class="filter-container">
        <input
            type="text"
            placeholder="Filtrar por Número de Teléfono"
            bind:value={numeroTelefonoFiltro}
        />
        <button class="btn-blue" on:click={filtrarPorNumeroTelefono}>Buscar</button>
    </div>

    {#if error}
        <p class="error-message">{error}</p>
    {/if}

    {#if suscripcionesFiltradas.length > 0}
        <ul>
            {#each suscripcionesFiltradas as suscripcion}
                <li>
                    <span>
                        <strong>Plan:</strong> {suscripcion.planNombre}<br>
                        <strong>Número:</strong> {suscripcion.numeroTelefono}<br>
                        <strong>Fecha:</strong> {new Date(suscripcion.fechaSuscripcion).toLocaleDateString()}
                    </span>
                    <div>
                        {#if confirmacionId === suscripcion.id}
                            <button class="btn-green" on:click={() => desuscribirse(suscripcion.id)}>Confirmar</button>
                            <button class="btn-red" on:click={cancelarConfirmacion}>Cancelar</button>
                        {:else}
                            <button class="btn-red" on:click={() => confirmarDesuscripcion(suscripcion.id)}>Desuscribirse</button>
                        {/if}
                    </div>
                </li>
            {/each}
        </ul>
    {:else}
        <p class="no-suscriptions">No tienes suscripciones registradas.</p>
    {/if}
</div>
