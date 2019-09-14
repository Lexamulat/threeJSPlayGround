
export const LOGIN = 'auth/LOGIN';
export const LOGOUT = 'auth/LOGOUT';

export function login() {
    return {
        type: LOGIN,
   
    };
}

export function logout() {
    return {
        type: LOGOUT,
    };
}
