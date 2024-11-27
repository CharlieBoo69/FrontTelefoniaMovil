<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { token, isAuthenticated } from './auth.js';
    import { get } from 'svelte/store';

    export let id;

    let planEdicion = null;

    async function cargarPlan() {
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
                planEdicion = await res.json();
            } else {
                console.error('Error al cargar el plan:', await res.text());
            }
        } catch (error) {
            console.error('Error al cargar el plan:', error);
        }
    }

    async function guardarCambios() {
        try {
            const authToken = get(token);
            const res = await fetch(`https://telefoniamovilbackendfinal.azurewebsites.net/api/PlanApi/${planEdicion.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(planEdicion),
            });

            if (res.ok) {
                console.log('Plan actualizado con éxito');
                navigate('/');
            } else {
                console.error('Error al actualizar el plan:', await res.text());
            }
        } catch (error) {
            console.error('Error al actualizar el plan:', error);
        }
    }

    function cancelarEdicion() {
        navigate('/');
    }

    onMount(() => {
        if (!get(isAuthenticated)) {
            navigate('/login');
        } else {
            cargarPlan();
        }
    });
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
        background-color: #1f4e78; /* Azul oscuro */
        color: white;
        padding: 15px;
        margin: 0;
        border-radius: 0 0 10px 10px;
        font-size: 24px;
    }

    .editar-container {
        max-width: 600px;
        margin: 30px auto;
        background: white;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .editar-container label {
        display: block;
        font-weight: bold;
        color: #333;
        margin-bottom: 5px;
    }

    .editar-container input {
        width: 100%;
        padding: 10px;
        margin-bottom: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 14px;
    }

    .editar-container input:focus {
        border-color: #1f4e78; /* Azul oscuro */
        outline: none;
    }

    .button-group {
        display: flex;
        justify-content: space-between;
    }

    .button-group button {
        flex: 1;
        padding: 12px;
        margin: 5px;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .save {
        background-color: #1f4e78; /* Azul oscuro */
        color: white;
    }

    .save:hover {
        background-color: #143d5b; /* Azul más oscuro */
    }

    .cancel {
        background-color: #d32f2f; /* Rojo */
        color: white;
    }

    .cancel:hover {
        background-color: #b71c1c; /* Rojo oscuro */
    }

    .loading {
        text-align: center;
        color: #777;
        font-size: 18px;
        margin-top: 20px;
    }
</style>

<h2>Editar Plan</h2>

{#if planEdicion}
    <div class="editar-container">
        <label for="nombre">Nombre del plan:</label>
        <input id="nombre" bind:value={planEdicion.nombre} placeholder="Ingrese el nombre del plan" />

        <label for="costo">Costo (USD):</label>
        <input id="costo" type="number" bind:value={planEdicion.costo} placeholder="Ingrese el costo en USD" />

        <label for="datos">Datos (GB):</label>
        <input id="datos" type="number" bind:value={planEdicion.datos} placeholder="Ingrese los datos en GB" />

        <label for="minutos">Minutos:</label>
        <input id="minutos" type="number" bind:value={planEdicion.minutos} placeholder="Ingrese los minutos" />

        <label for="sms">SMS:</label>
        <input id="sms" type="number" bind:value={planEdicion.sms} placeholder="Ingrese los SMS" />

        <label for="operadora">Operadora:</label>
        <input id="operadora" bind:value={planEdicion.operadora} placeholder="Ingrese la operadora" />

        <label for="beneficios">Beneficios Adicionales:</label>
        <input id="beneficios" bind:value={planEdicion.beneficiosAdicionales} placeholder="Ingrese los beneficios adicionales" />

        <div class="button-group">
            <button class="save" on:click={guardarCambios}>Guardar Cambios</button>
            <button class="cancel" on:click={cancelarEdicion}>Cancelar</button>
        </div>
    </div>
{:else}
    <p class="loading">Cargando plan...</p>
{/if}
