import { applyMiddleware, compose, createStore } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import makeRootReducer from './reducers';
import allReducers from '../reducers/reducersRegistry';

import thunk from 'redux-thunk';
import history from './history';

import httpRequestMiddleware from './httpRequestMiddleware';

export default function configureStore(initialState) {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const middleware = [thunk, httpRequestMiddleware, routerMiddleware(history)];

    const store = createStore(
        (makeRootReducer(history, allReducers)),
        initialState,
        composeEnhancers(applyMiddleware(...middleware)),
    );

    store.asyncReducers = allReducers;

    if (module.hot) {
        // module.hot.accept()

        module.hot.accept('./reducers', () => {

            console.log('!!!!!!! INN REQUIRE !!!!')

            const reducers = require('./reducers').default;
            store.replaceReducer(reducers(store.asyncReducers));
        });
    }

    return store;
}
