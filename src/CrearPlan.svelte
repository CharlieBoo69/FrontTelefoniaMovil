<script>
    import { navigate } from 'svelte-routing';
    import { token } from './auth.js';
    import { get } from 'svelte/store';

    let nuevoPlan = {
        nombre: '',
        costo: 0,
        datos: 0,
        minutos: 0,
        sms: 0,
        operadora: '',
        beneficiosAdicionales: '',
    };

    async function crearPlan() {
        try {
            const authToken = get(token);

            const res = await fetch('https://telefoniamovilbackendfinal.azurewebsites.net/api/PlanApi', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevoPlan),
                credentials: 'include',
            });

            if (res.ok) {
                console.log('Plan creado con éxito');
                navigate('/'); // Redirige a la página principal después de la creación
            } else {
                const errorText = await res.text();
                console.error('Error al crear el plan:', errorText);
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    }

    function cancelar() {
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
        background-color: #1f4e78; /* Azul oscuro */
        color: white;
        padding: 15px;
        margin: 0;
        border-radius: 0 0 10px 10px;
        font-size: 24px;
    }

    .form-container {
        max-width: 600px;
        margin: 30px auto;
        background: white;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .form-container label {
        font-weight: bold;
        color: #333;
        margin-bottom: 5px;
        display: block;
    }

    .form-container input {
        width: 100%;
        padding: 10px;
        margin-bottom: 15px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 14px;
    }

    .form-container input:focus {
        border-color: #1f4e78;
        outline: none;
    }

    .button-group {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }

    .button-group button {
        flex: 1;
        padding: 12px;
        margin: 5px;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .create-btn {
        background-color: #1f4e78; /* Azul oscuro */
        color: white;
    }

    .create-btn:hover {
        background-color: #143d5b; /* Azul más oscuro */
    }

    .cancel-btn {
        background-color: #d32f2f; /* Rojo */
        color: white;
    }

    .cancel-btn:hover {
        background-color: #b71c1c; /* Rojo oscuro */
    }
</style>

<h2>Crear Nuevo Plan</h2>

<div class="form-container">
    <label for="nombre">Nombre del plan:</label>
    <input id="nombre" bind:value={nuevoPlan.nombre} placeholder="Ejemplo: Plan Básico" />

    <label for="costo">Costo (USD):</label>
    <input id="costo" type="number" bind:value={nuevoPlan.costo} placeholder="Ejemplo: 10" />

    <label for="datos">Datos (GB):</label>
    <input id="datos" type="number" bind:value={nuevoPlan.datos} placeholder="Ejemplo: 5" />

    <label for="minutos">Minutos:</label>
    <input id="minutos" type="number" bind:value={nuevoPlan.minutos} placeholder="Ejemplo: 100" />

    <label for="sms">SMS:</label>
    <input id="sms" type="number" bind:value={nuevoPlan.sms} placeholder="Ejemplo: 50" />

    <label for="operadora">Operadora:</label>
    <input id="operadora" bind:value={nuevoPlan.operadora} placeholder="Ejemplo: Operadora A" />

    <label for="beneficios">Beneficios Adicionales:</label>
    <input
        id="beneficios"
        bind:value={nuevoPlan.beneficiosAdicionales}
        placeholder="Ejemplo: Roaming incluido"
    />

    <div class="button-group">
        <button class="create-btn" on:click={crearPlan}>Crear Plan</button>
        <button class="cancel-btn" on:click={cancelar}>Cancelar</button>
    </div>
</div>
