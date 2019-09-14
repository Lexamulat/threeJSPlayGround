import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Router from './routes/Router.jsx';



import 'styles/main.scss';




export default class Root extends React.Component {

    render() {
        const { store } = this.props;
        return (
            <Provider store={store}>
                <Router />
            </Provider>
        );
    }
}

