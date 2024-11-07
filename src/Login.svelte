<script>
    import { navigate } from 'svelte-routing';
    import { loginWithToken } from './auth.js';
    
    let username = '';
    let password = '';
    let error = '';

    async function login() {
        const response = await fetch('https://telefoniamovilbackend20241106190423.azurewebsites.net/api/Auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            loginWithToken(data.token, data.role);
            navigate('/');
        } else {
            error = 'Credenciales incorrectas';
        }
    }
</script>

<h2>Inicio de Sesión</h2>
{#if error}
    <p style="color: red;">{error}</p>
{/if}
<div>
    <label>Usuario:</label>
    <input bind:value={username} />
    <label>Contraseña:</label>
    <input type="password" bind:value={password} />
    <button on:click={login}>Iniciar Sesión</button>
</div>
