import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/Root';
import configureStore from 'store/configureStore';
import { initLocale } from 'sources/locale/localeHelper';



import './styles/main.scss'
const RootEl = document.getElementById('root')

// initLocale();
const store = configureStore();

ReactDOM.render(<Root store={store} />, RootEl);

if (module.hot) {
    module.hot.accept();
}
