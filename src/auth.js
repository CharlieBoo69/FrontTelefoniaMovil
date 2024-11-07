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
export function logout() {
    isAuthenticated.set(false);
    userRole.set(null);
    token.set(null);

    // Elimina el token y el rol de localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
}

// Restaura el estado de autenticación al recargar
const storedToken = localStorage.getItem('token');
const storedRole = localStorage.getItem('userRole');
if (storedToken && storedRole) {
    isAuthenticated.set(true);
    userRole.set(storedRole);
    token.set(storedToken);
}
