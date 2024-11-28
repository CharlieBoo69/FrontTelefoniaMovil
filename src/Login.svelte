<script>
    import { navigate } from 'svelte-routing';
    import { loginWithToken } from './auth.js';
    
    let username = '';
    let password = '';
    let error = '';

    async function login() {
        try {
            const response = await fetch('http://localhost:5181/api/Auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                loginWithToken(data.token, data.role);
                navigate('/'); // Redirige a la página principal
            } else {
                error = 'Credenciales incorrectas';
            }
        } catch (err) {
            console.error('Error en la solicitud de inicio de sesión:', err);
            error = 'Ocurrió un error al intentar iniciar sesión.';
        }
    }
</script>

<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f0f4f8;
        margin: 0;
        padding: 0;
    }

    .login-container {
        max-width: 400px;
        margin: 80px auto;
        background: white;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        padding: 30px;
        text-align: center;
    }

    h2 {
        margin-bottom: 20px;
        color: #1f4e78;
        font-size: 24px;
    }

    .error {
        color: #d32f2f;
        font-size: 14px;
        margin-bottom: 15px;
    }

    label {
        display: block;
        font-weight: bold;
        margin-top: 10px;
        color: #555;
        text-align: left;
        margin-bottom: 5px;
    }

    input {
        width: 100%;
        padding: 10px;
        margin-bottom: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 14px;
    }

    input:focus {
        border-color: #1f4e78;
        outline: none;
        box-shadow: 0 0 5px rgba(31, 78, 120, 0.5);
    }

    button {
        width: 100%;
        background-color: #1f4e78;
        color: white;
        border: none;
        padding: 12px;
        font-size: 16px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #143d5b;
    }

    button:active {
        background-color: #0e2a41;
    }
</style>

<div class="login-container">
    <h2>Inicio de Sesión</h2>
    {#if error}
        <p class="error">{error}</p>
    {/if}
    <div>
        <label for="username">Usuario:</label>
        <input id="username" bind:value={username} placeholder="Ingresa tu usuario" />
        
        <label for="password">Contraseña:</label>
        <input id="password" type="password" bind:value={password} placeholder="Ingresa tu contraseña" />
        
        <button on:click={login}>Iniciar Sesión</button>
    </div>
</div>
