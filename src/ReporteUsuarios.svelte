<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { isAuthenticated } from './auth.js';
    import { get } from 'svelte/store';

    let reporte = [];
    let fechaInicio = '';
    let fechaFin = '';
    let error = '';

    onMount(() => {
        if (!get(isAuthenticated)) {
            navigate('/login');
        } else {
            cargarReporte(); 
        }
    });

    async function cargarReporte() {
        error = ''; 
        try {
            let url = 'http://localhost:5181/api/Suscripcion/ReporteUsuarios';

           
            if (fechaInicio || fechaFin) {
                const params = new URLSearchParams();
                if (fechaInicio) params.append('fechaInicio', fechaInicio);
                if (fechaFin) params.append('fechaFin', fechaFin);
                url += `?${params.toString()}`;
            }

            // Hacer la solicitud al backend
            const res = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (res.ok) {
                reporte = await res.json();
                console.log('Datos del reporte:', reporte);
            } else {
                const mensajeError = await res.text();
                console.error('Error del servidor:', mensajeError);
                error = mensajeError || 'No se pudo obtener el reporte.';
                reporte = []; 
            }
        } catch (err) {
            console.error('Error al cargar el reporte:', err);
            error = 'Ocurrió un error al conectar con el servidor.';
            reporte = []; 
        }
    }
</script>

<style>
    h1 {
        text-align: center;
        color: #007bff;
        background-color: #ffffff;
        padding: 15px;
        margin: 0;
        border-radius: 0 0 10px 10px;
    }

    .filter-container {
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        background-color: white;
        border-radius: 10px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        font-size: 16px;
    }

    th, td {
        padding: 10px;
        border: 1px solid #ddd;
    }

    th {
        background-color: #007bff;
        color: white;
    }

    .error {
        color: red;
        text-align: center;
        font-weight: bold;
    }
</style>

<h1>Reporte de Usuarios</h1>

<div class="filter-container">
    <label for="fechaInicio">Fecha Inicio:</label>
    <input id="fechaInicio" type="date" bind:value={fechaInicio} />

    <label for="fechaFin">Fecha Fin:</label>
    <input id="fechaFin" type="date" bind:value={fechaFin} />

    <button on:click={cargarReporte}>Filtrar</button>
</div>

{#if error}
    <p class="error">{error}</p>
{/if}

{#if reporte.length > 0}
    <table>
        <thead>
            <tr>
                <th>Usuario ID</th>
                <th>Nombre de Usuario</th>
                <th>Total de Suscripciones</th>
                <th>Planes Repetidos</th>
            </tr>
        </thead>
        <tbody>
            {#each reporte as usuario}
                <tr>
                    <td>{usuario.usuarioId || 'N/A'}</td>
                    <td>{usuario.nombreUsuario || 'N/A'}</td>
                    <td>{usuario.totalSuscripciones || 0}</td>
                    <td>
                        {#if usuario.planesRepetidos && usuario.planesRepetidos.length > 0}
                            {usuario.planesRepetidos.join(', ')}
                        {:else}
                            Ninguno
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{:else}
    <p class="error">No hay datos para mostrar.</p>
{/if}
