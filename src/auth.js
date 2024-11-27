import { writable } from 'svelte/store';

// Variables de estado
export const isAuthenticated = writable(false);
export const userRole = writable(null);
export const token = writable(null);

// Función para manejar el inicio de sesión con token y rol
export function loginWithToken(authToken, role) {
    isAuthenticated.set(true);
    userRole.set(role);
    token.set(authToken);

    // Guarda el token y el rol en localStorage para mantener la sesión al recargar
    localStorage.setItem('token', authToken);
    localStorage.setItem('userRole', role);
}

// Función para cerrar sesión
export async function logout() {
    isAuthenticated.set(false);
    userRole.set(null);
    token.set(null);

    // Elimina el token y el rol de localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');

    // Llama al endpoint de logout para limpiar las cookies de sesión en el backend
    try {
        const response = await fetch('https://telefoniamovilbackendfinal.azurewebsites.net/api/Auth/logout', {
            method: 'POST',
            credentials: 'include', // Asegura el envío de cookies
        });

        if (!response.ok) {
            console.error('Error al cerrar sesión en el backend:', await response.text());
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}

// Restaura el estado de autenticación al recargar
const storedToken = localStorage.getItem('token');
const storedRole = localStorage.getItem('userRole');
if (storedToken && storedRole) {
    isAuthenticated.set(true);
    userRole.set(storedRole);
    token.set(storedToken);
}
