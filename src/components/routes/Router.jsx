import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import history from 'store/history';

import TestContainer from 'components/Test/TestContainer';


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

                </Switch>
            </ConnectedRouter>
        );
    }
}
