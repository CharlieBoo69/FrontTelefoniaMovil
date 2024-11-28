<script>
    import { navigate } from 'svelte-routing';
    import { token } from './auth.js';
    import { get } from 'svelte/store';

    // Estructura de la nueva suscripción
    let nuevaSuscripcion = {
        usuarioId: null,
        planId: null,
        numeroTelefono: '',
        fechaSuscripcion: new Date().toISOString().split("T")[0] // Fecha actual en formato YYYY-MM-DD
    };

    // Función para crear la suscripción
    async function crearSuscripcion() {
        try {
            const authToken = get(token); // Obtener el token actual
            const res = await fetch('http://localhost:5181/api/Suscripcion', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`, // Token para permisos y roles
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevaSuscripcion),
                credentials: 'include' // Incluir cookies para la sesión
            });

            if (res.ok) {
                console.log('Suscripción creada con éxito');
                navigate('/suscripciones'); // Redirigir a la página de suscripciones después de crear
            } else {
                console.error('Error al crear la suscripción:', await res.text());
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    }

    // Función para cancelar y regresar a la página de suscripciones
    function cancelar() {
        navigate('/suscripciones');
    }
</script>

<style>
    body {
        font-family: 'Arial', sans-serif;
        background-color: #f4f4f4;
        color: #333;
    }

    h2 {
        text-align: center;
        color: #333;
    }

    .form-container {
        max-width: 600px;
        margin: 20px auto;
        background: #fff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .form-group {
        margin-bottom: 15px;
    }

    label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }

    input {
        width: 100%;
        padding: 10px;
        font-size: 14px;
        border: 1px solid #ccc;
        border-radius: 5px;
        outline: none;
    }

    input:focus {
        border-color: #4CAF50;
    }

    .button-group {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }

    button {
        padding: 10px 15px;
        font-size: 14px;
        color: white;
        background-color: #4CAF50;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    button:hover {
        background-color: #45a049;
    }

    button.cancel {
        background-color: #f44336;
    }

    button.cancel:hover {
        background-color: #e53935;
    }
</style>

<h2>Crear Nueva Suscripción</h2>

<div class="form-container">
    <div class="form-group">
        <label>Usuario ID:</label>
        <input type="number" bind:value={nuevaSuscripcion.usuarioId} />
    </div>

    <div class="form-group">
        <label>Plan ID:</label>
        <input type="number" bind:value={nuevaSuscripcion.planId} />
    </div>

    <div class="form-group">
        <label>Número de Teléfono:</label>
        <input type="text" bind:value={nuevaSuscripcion.numeroTelefono} />
    </div>

    <div class="form-group">
        <label>Fecha de Suscripción:</label>
        <input type="date" bind:value={nuevaSuscripcion.fechaSuscripcion} />
    </div>

    <div class="button-group">
        <button on:click={crearSuscripcion}>Crear Suscripción</button>
        <button class="cancel" on:click={cancelar}>Cancelar</button>
    </div>
</div>
