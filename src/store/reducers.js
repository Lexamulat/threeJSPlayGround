import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

export const makeRootReducer = (history, asyncReducers) => {
    return combineReducers({
        router: connectRouter(history),
        ...asyncReducers,
    });
};

export default makeRootReducer;
