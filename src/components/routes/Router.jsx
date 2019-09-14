import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import history from 'store/history';

import TestContainer from 'components/Test/TestContainer';
import LoginPageContainer from 'components/LoginPage/LoginPageContainer';


export default class Router extends Component {
    render() {
        return (
            <ConnectedRouter history={history}>
                <Switch>
                    <Route
                        exact
                        path="/"
                        component={TestContainer}
                    />
                    <Route
                        exact
                        path="/login"
                        component={LoginPageContainer}
                    />
                </Switch>
            </ConnectedRouter>
        );
    }
}
