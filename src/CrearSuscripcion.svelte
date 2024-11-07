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
        const authToken = get(token); // Obtener el token actual
        const res = await fetch('https://telefoniamovilbackend20241106190423.azurewebsites.net/api/Suscripcion', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaSuscripcion)
        });

        if (res.ok) {
            console.log('Suscripción creada con éxito');
            navigate('/suscripciones'); // Redirigir a la página de suscripciones después de crear
        } else {
            console.error('Error al crear la suscripción:', await res.text());
        }
    }

    // Función para cancelar y regresar a la página de suscripciones
    function cancelar() {
        navigate('/suscripciones');
    }
</script>

<h2>Crear Nueva Suscripción</h2>

<div>
    <label>Usuario ID:</label>
    <input type="number" bind:value={nuevaSuscripcion.usuarioId} />

    <label>Plan ID:</label>
    <input type="number" bind:value={nuevaSuscripcion.planId} />

    <label>Número de Teléfono:</label>
    <input bind:value={nuevaSuscripcion.numeroTelefono} />

    <label>Fecha de Suscripción:</label>
    <input type="date" bind:value={nuevaSuscripcion.fechaSuscripcion} />

    <button on:click={crearSuscripcion}>Crear Suscripción</button>
    <button on:click={cancelar}>Cancelar</button>
</div>
