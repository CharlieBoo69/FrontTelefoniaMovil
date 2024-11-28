<script>
    import { navigate } from "svelte-routing";

   
    let nuevoUsuario = {
        nombre: "",
        email: "",
        telefono: "",
        password: "",
        isAdmin: false,
    };

    let mensajeError = "";
    let mensajeExito = "";

    async function crearUsuario() {
        try {
            mensajeError = "";
            mensajeExito = "";

           
            const res = await fetch("http://localhost:5181/api/Usuario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoUsuario),
            });

            if (res.ok) {
                mensajeExito = "Usuario creado con éxito.";
                nuevoUsuario = {
                    nombre: "",
                    email: "",
                    telefono: "",
                    password: "",
                    isAdmin: false,
                };
            } else {
                const error = await res.text();
                mensajeError = error || "Ocurrió un error al crear el usuario.";
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            mensajeError = "No se pudo conectar con el servidor.";
        }
    }

    function cancelar() {
        navigate("/"); 
    }
</script>

<style>
    /* Estilos básicos */
    .form-container {
        max-width: 600px;
        margin: 30px auto;
        background: white;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    label {
        font-weight: bold;
        margin-bottom: 5px;
        display: block;
    }

    input {
        width: 100%;
        padding: 10px;
        margin-bottom: 15px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    button {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .create-btn {
        background-color: #388e3c;
        color: white;
    }

    .cancel-btn {
        background-color: #d32f2f;
        color: white;
    }

    .message {
        text-align: center;
        font-weight: bold;
    }

    .error {
        color: #d32f2f;
    }

    .success {
        color: #388e3c;
    }
</style>

<div class="form-container">
    <h2>Crear Nuevo Usuario</h2>

    {#if mensajeError}
        <p class="message error">{mensajeError}</p>
    {/if}

    {#if mensajeExito}
        <p class="message success">{mensajeExito}</p>
    {/if}

    <label for="nombre">Nombre:</label>
    <input id="nombre" type="text" bind:value={nuevoUsuario.nombre} placeholder="Nombre del usuario" />

    <label for="email">Email:</label>
    <input id="email" type="email" bind:value={nuevoUsuario.email} placeholder="Correo electrónico" />

    <label for="telefono">Teléfono:</label>
    <input id="telefono" type="text" bind:value={nuevoUsuario.telefono} placeholder="Teléfono del usuario" />

    <label for="password">Contraseña:</label>
    <input id="password" type="password" bind:value={nuevoUsuario.password} placeholder="Contraseña" />

    <label>
        <input type="checkbox" bind:checked={nuevoUsuario.isAdmin} />
        Es administrador
    </label>

    <div class="button-group">
        <button class="create-btn" on:click={crearUsuario}>Crear Usuario</button>
        <button class="cancel-btn" on:click={cancelar}>Cancelar</button>
    </div>
</div>
