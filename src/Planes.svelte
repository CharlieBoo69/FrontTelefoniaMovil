<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { isAuthenticated, userRole, token, logout } from './auth.js';
    import { get } from 'svelte/store';

    let planes = [];
    let operadoras = [];
    let operadoraSeleccionada = "Todas las Operadoras";

    // Redirige automáticamente si el usuario no está autenticado
    onMount(() => {
        if (!get(isAuthenticated)) {
            navigate('/login');
        } else {
            cargarOperadorasYPlanes(); // Carga los planes y operadoras si está autenticado
        }
    });

    // Cargar las operadoras únicas y los planes desde el backend
    async function cargarOperadorasYPlanes() {
        try {
            const authToken = get(token);
            const res = await fetch('https://telefoniamovilbackend20241106190423.azurewebsites.net/api/PlanApi', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            if (res.ok) {
                planes = await res.json();
                obtenerOperadorasUnicas();
                filtrarPlanes(); // Mostrar todos los planes al cargar
            } else {
                console.error('Error al cargar los planes:', res.status, res.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud de carga de planes:', error);
        }
    }

    // Obtener operadoras únicas de los planes
    function obtenerOperadorasUnicas() {
        const operadorasSet = new Set(planes.map(plan => plan.operadora));
        operadoras = ["Todas las Operadoras", ...operadorasSet];
        console.log('Operadoras únicas:', operadoras);
    }

    // Filtrar los planes por operadora desde el backend
    async function filtrarPlanes() {
        try {
            const authToken = get(token);
            let url = 'https://telefoniamovilbackend20241106190423.azurewebsites.net/api/PlanApi';
            if (operadoraSeleccionada !== "Todas las Operadoras") {
                url += `/ByOperadora/${encodeURIComponent(operadoraSeleccionada)}`;
            }

            const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                planes = await res.json();
                console.log('Planes filtrados cargados:', planes);
            } else {
                console.error('Error al cargar los planes filtrados:', res.status, res.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud de carga de planes filtrados:', error);
        }
    }

    // Redirigir a la página de edición
    function editarPlan(id) {
        navigate(`/editar/${id}`);
    }

    // Redirigir a la página de creación
    function crearNuevoPlan() {
        navigate('/crear');
    }

    // Redirigir a la página de detalles
    function verDetallePlan(id) {
        navigate(`/detalle-plan/${id}`);
    }

    // Eliminar un plan con confirmación y autenticación
    async function eliminarPlan(id) {
        const confirmacion = confirm('¿Estás seguro de que deseas eliminar este plan?');
        if (confirmacion) {
            try {
                const authToken = get(token);
                const res = await fetch(`https://telefoniamovilbackend20241106190423.azurewebsites.net/api/PlanApi/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (res.ok) {
                    planes = planes.filter(plan => plan.id !== id);
                    console.log('Plan eliminado con éxito');
                } else {
                    console.error('Error al eliminar el plan:', res.status, res.statusText);
                }
            } catch (error) {
                console.error('Error en la solicitud de eliminación de plan:', error);
            }
        }
    }

    // Función para cerrar sesión y redirigir al login
    function handleLogout() {
        logout();
        navigate('/login');
    }
</script>

<h1>Planes de Telefonía</h1>

<button on:click={handleLogout}>Cerrar Sesión</button>

{#if $userRole === 'admin'}
    <button on:click={crearNuevoPlan}>Crear Nuevo Plan</button>
    <button on:click={() => navigate('/suscripciones')}>Gestionar Suscripciones</button>
{/if}

<!-- Filtro de operadora -->
<select bind:value={operadoraSeleccionada} on:change={filtrarPlanes}>
    {#each operadoras as operadora}
        <option>{operadora}</option>
    {/each}
</select>

<ul>
    {#each planes as plan (plan.id)}
        <li>
            {plan.nombre} - {plan.costo} USD - {plan.operadora}
            <button on:click={() => verDetallePlan(plan.id)}>Ver Detalles</button>
            {#if $userRole === 'admin'}
                <button on:click={() => editarPlan(plan.id)}>Editar</button>
                <button on:click={() => eliminarPlan(plan.id)}>Eliminar</button>
            {/if}
        </li>
    {/each}
</ul>
