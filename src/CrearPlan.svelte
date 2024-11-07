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
        beneficiosAdicionales: ''
    };


    async function crearPlan() {
    const authToken = get(token);
    console.log("Token actual:", authToken); // Revisa que el token sea el esperado

    const res = await fetch('https://telefoniamovilbackend20241106190423.azurewebsites.net/api/PlanApi', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoPlan),
    });

    if (res.ok) {
        console.log('Plan creado con éxito');
        navigate('/');
    } else {
        console.error('Error al crear el plan:', await res.text());
    }
}





    // Función para cancelar la creación de un plan y regresar a la página principal
    function cancelar() {
        navigate('/');
    }
</script>

<h2>Crear Nuevo Plan</h2>

<div>
    <label>Nombre del plan:</label>
    <input bind:value={nuevoPlan.nombre} />
    <label>Costo (USD):</label>
    <input type="number" bind:value={nuevoPlan.costo} />
    <label>Datos (GB):</label>
    <input type="number" bind:value={nuevoPlan.datos} />
    <label>Minutos:</label>
    <input type="number" bind:value={nuevoPlan.minutos} />
    <label>SMS:</label>
    <input type="number" bind:value={nuevoPlan.sms} />
    <label>Operadora:</label>
    <input bind:value={nuevoPlan.operadora} />
    <label>Beneficios Adicionales:</label>
    <input bind:value={nuevoPlan.beneficiosAdicionales} />
    <button on:click={crearPlan}>Crear plan</button>
    <button on:click={cancelar}>Cancelar</button>
</div>
