<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { isAuthenticated, token } from './auth.js';
    import { get } from 'svelte/store';
    import Chart from 'chart.js/auto';

    let suscripcionesPopulares = [];
    let suscripciones = [];
    let planIdFiltro = ''; // Variable para el filtro por Plan ID
    let suscripcionesFiltradas = [];
    let chart; // Referencia al gráfico

    // Redirige automáticamente si el usuario no está autenticado
    onMount(() => {
        if (!get(isAuthenticated)) {
            navigate('/login');
        } else {
            cargarSuscripcionesPopulares();
            cargarTodasLasSuscripciones();
        }
    });

    // Función para cargar las suscripciones más populares desde el backend
    async function cargarSuscripcionesPopulares() {
        try {
            const authToken = get(token);
            const res = await fetch('https://telefoniamovilbackendfinal.azurewebsites.net/api/Suscripcion/TopPlanes', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include' // Envía las cookies al backend
            });
            if (res.ok) {
                suscripcionesPopulares = await res.json();
                renderizarGrafico(); // Renderiza el gráfico al cargar los datos
            } else {
                console.error('Error al cargar las suscripciones más populares:', res.status, res.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud de suscripciones populares:', error);
        }
    }

    // Función para renderizar el gráfico de barras
    function renderizarGrafico() {
        const ctx = document.getElementById('graficoSuscripciones').getContext('2d');
        if (chart) {
            chart.destroy(); // Destruye el gráfico anterior si existe
        }

        const labels = suscripcionesPopulares.map(p => `Plan ID ${p.planId}`);
        const data = suscripcionesPopulares.map(p => p.totalSuscripciones);

        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Total Suscripciones',
                    data,
                    backgroundColor: 'rgba(31, 78, 120, 0.5)', // Azul oscuro
                    borderColor: 'rgba(31, 78, 120, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true },
                    tooltip: { enabled: true }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // Función para cargar todas las suscripciones desde el backend
    async function cargarTodasLasSuscripciones() {
        try {
            const authToken = get(token);
            const res = await fetch('https://telefoniamovilbackendfinal.azurewebsites.net/api/Suscripcion', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (res.ok) {
                suscripciones = await res.json();
                suscripcionesFiltradas = suscripciones;
            } else {
                console.error('Error al cargar todas las suscripciones:', res.status, res.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud de todas las suscripciones:', error);
        }
    }

    // Función para eliminar una suscripción
    async function eliminarSuscripcion(id) {
        const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta suscripción?');
        if (confirmacion) {
            try {
                const authToken = get(token);
                const res = await fetch(`https://telefoniamovilbackendfinal.azurewebsites.net/api/Suscripcion/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                if (res.ok) {
                    suscripciones = suscripciones.filter(s => s.id !== id);
                    suscripcionesFiltradas = suscripciones.filter(s => s.id !== id);
                    console.log('Suscripción eliminada con éxito');
                } else {
                    console.error('Error al eliminar la suscripción:', res.status, res.statusText);
                }
            } catch (error) {
                console.error('Error al eliminar la suscripción:', error);
            }
        }
    }

    // Función para redirigir a la página de edición de suscripción
    function editarSuscripcion(id) {
        navigate(`/editar-suscripcion/${id}`);
    }

    // Función para redirigir a la página de creación de suscripción
    function crearNuevaSuscripcion() {
        navigate('/crear-suscripcion');
    }

    // Función para regresar a la página principal
    function volverAPaginaPrincipal() {
        navigate('/');
    }

    // Función para filtrar las suscripciones por Plan ID
    function filtrarSuscripcionesPorPlan() {
        if (planIdFiltro.trim() === '') {
            suscripcionesFiltradas = suscripciones;
        } else {
            suscripcionesFiltradas = suscripciones.filter(
                s => s.planId.toString() === planIdFiltro
            );
        }
    }
</script>

<style>
    body {
        font-family: 'Arial', sans-serif;
        background-color: #f0f4f8;
        margin: 0;
        padding: 0;
    }

    h1, h2 {
        text-align: center;
        color: #1f4e78; /* Azul oscuro */
    }

    .button-container {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }

    button {
        padding: 10px 15px;
        margin: 5px;
        font-size: 14px;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    button:hover {
        filter: brightness(90%);
    }

    .button-container button {
        background-color: #1f4e78;
    }

    button.red {
        background-color: #d32f2f; /* Rojo */
    }

    button.red:hover {
        background-color: #b71c1c;
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
        background-color: #143d5b; /* Azul más oscuro */
    }

    #graficoSuscripciones {
        max-width: 700px;
        max-height: 400px;
        margin: 20px auto;
    }

    .filter-container {
        text-align: center;
        margin: 20px 0;
    }

    input {
        padding: 8px;
        font-size: 14px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    input:focus {
        border-color: #1f4e78;
        outline: none;
    }

    .table-container {
        margin: 20px auto;
        max-width: 90%;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        background: #fff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
    }

    th {
        background: #1f4e78;
        color: white;
    }

    tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    td button {
        padding: 5px 10px;
        font-size: 12px;
        margin: 0 3px;
    }
</style>

<h1>Suscripciones</h1>

<div class="button-container">
    <button class="green" on:click={volverAPaginaPrincipal}>Volver a la Página Principal</button>
    <button class="blue" on:click={crearNuevaSuscripcion}>Crear Nueva Suscripción</button>
</div>

<h2>Suscripciones Más Populares</h2>
<div style="display: flex; flex-direction: column; align-items: center;">
    <canvas id="graficoSuscripciones"></canvas>
</div>

<h2>Todas las Suscripciones</h2>

<div class="filter-container">
    <label for="planIdFiltro">Filtrar por Plan ID:</label>
    <input id="planIdFiltro" type="text" bind:value={planIdFiltro} placeholder="Ejemplo: 123" />
    <button class="blue" on:click={filtrarSuscripcionesPorPlan}>Buscar</button>
</div>

<div class="table-container">
    <table>
        <thead>
            <tr>
                <th>Usuario ID</th>
                <th>Plan ID</th>
                <th>Número de Teléfono</th>
                <th>Fecha</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {#each suscripcionesFiltradas as suscripcion}
                <tr>
                    <td>{suscripcion.usuarioId}</td>
                    <td>{suscripcion.planId}</td>
                    <td>{suscripcion.numeroTelefono}</td>
                    <td>{new Date(suscripcion.fechaSuscripcion).toLocaleDateString()}</td>
                    <td>
                        <button class="green" on:click={() => editarSuscripcion(suscripcion.id)}>Editar</button>
                        <button class="red" on:click={() => eliminarSuscripcion(suscripcion.id)}>Eliminar</button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
