import _ from 'lodash';
import HttpClient from '../sources/api/http/HttpClient';
import extractHttpResponse from '../sources/api/http/extractHttpResponse';
import { isUnauthorizeError, isInternalServer, isNotServerError } from '../sources/api/ApiError';
import * as extendActionType from 'reducers/extendActionType';

const request = new HttpClient();

export default function httpRequestMiddleware({ dispatch, getState }) {
    return (next) => (action) => {
        if (typeof action === 'function') return action(dispatch, getState);

        const { reportAPI, changeStoreByYourself, httpRequest, type, ...rest } = action;

        if (!httpRequest) return next(action);

        const [SUCCESS, FAILURE] = getTypes(type);

        const state = getState();

        const token = _.get(state, 'auth.login.accessToken', localStorage.getItem('token'));

        const { method, path, data, files, params } = httpRequest;
        const parseResult = httpRequest.parseResult || _.identity;

        next({ ...rest, type });

        return request[method]
            .call(request, path, {
                reportAPI,
                params,
                data,
                files,
                token,
            })
            .then(extractHttpResponse)
            .then(
                (result) => {
                    const parsedResult = parseResult(result);
                    const actionData = {
                        ...rest,
                        result: parsedResult,
                        request: httpRequest,
                    };
                    dispatchResult(next, actionData, SUCCESS);
                },
                (error) => {
                    if (isNotServerError(error)) console.error(error);

                    if (isInternalServer(error)) console.error('Internal server error', error);

                    // if (isUnauthorizeError(error) && state.auth.login && _.get(state, 'auth.login.role'))
                    //     return next(logoutByServer());

                    next({ ...rest, error, type: FAILURE });
                },
            )
            .catch((error) => {
                console.error('httpRequestMiddleware', error);

                next({ ...rest, error, type: FAILURE });
            });
    };
}

function getTypes(type) {
    return [extendActionType.success(type), extendActionType.fail(type)];
}

function dispatchResult(next, actionData, resultType) {
    const types = Array.isArray(resultType) ? resultType : [resultType];

    types.forEach((type) => next({ ...actionData, type }));
}
