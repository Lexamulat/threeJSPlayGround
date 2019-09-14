import createReducerByMap from '../createReducerByMap';
import { LOGIN, LOGOUT } from './authActions';


const initialState = {
    authLoaded: false,
};

const reducerMap = {
    [LOGIN]: login,
    [LOGOUT]: logout,
};

export default createReducerByMap(initialState, reducerMap);

function login(state, action) {
    const { result } = action;

    if (result) {
        if (result.access == true) {
            return {
                ...state,
                role: 'admin',
            };
        } else {
            return {
                ...state,
                loginError: 'error',
            };
        }
    }
    delete state.loginError;
    return {
        ...state,
    };
}

function logout(state, action) {
    delete state.loginError;
    return {
        ...state,
        role: '',
    };
}
