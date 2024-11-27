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
        try {
            const authToken = get(token);
            const res = await fetch(`https://telefoniamovilbackendfinal.azurewebsites.net/api/Suscripcion/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (res.ok) {
                suscripcion = await res.json();
            } else {
                console.error('Error al cargar la suscripción:', await res.text());
            }
        } catch (error) {
            console.error('Error al cargar la suscripción:', error);
        }
    }

    // Función para guardar los cambios en la suscripción
    async function guardarCambios() {
        try {
            const authToken = get(token);
            const res = await fetch(`https://telefoniamovilbackendfinal.azurewebsites.net/api/Suscripcion/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(suscripcion),
            });

            if (res.ok) {
                console.log('Suscripción actualizada con éxito');
                navigate('/suscripciones');
            } else {
                console.error('Error al actualizar la suscripción:', await res.text());
            }
        } catch (error) {
            console.error('Error al actualizar la suscripción:', error);
        }
    }

    // Función para cancelar la edición y regresar a la página de suscripciones
    function cancelar() {
        navigate('/suscripciones');
    }
</script>

<style>
    body {
        font-family: 'Arial', sans-serif;
        background-color: #f5f5f5;
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
        max-width: 500px;
        margin: 30px auto;
        background: white;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .editar-container label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        color: #333;
    }

    .editar-container input {
        width: 100%;
        padding: 10px;
        margin-bottom: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 14px;
    }

    .editar-container input[readonly] {
        background-color: #f0f0f0;
        cursor: not-allowed;
    }

    .button-group {
        display: flex;
        justify-content: space-between;
    }

    .editar-container button {
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

<h2>Editar Suscripción</h2>

{#if suscripcion}
    <div class="editar-container">
        <label>Usuario ID:</label>
        <input type="number" bind:value={suscripcion.usuarioId} readonly />

        <label>Plan ID:</label>
        <input type="number" bind:value={suscripcion.planId} placeholder="Ingrese el ID del plan" />

        <label>Teléfono:</label>
        <input type="text" bind:value={suscripcion.numeroTelefono} placeholder="Ingrese el número de teléfono" />

        <div class="button-group">
            <button class="save" on:click={guardarCambios}>Guardar Cambios</button>
            <button class="cancel" on:click={cancelar}>Cancelar</button>
        </div>
    </div>
{:else}
    <p class="loading">Cargando suscripción...</p>
{/if}
