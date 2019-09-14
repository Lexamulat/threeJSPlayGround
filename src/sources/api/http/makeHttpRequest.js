import makeRequest from './HttpClient';
import extractHttpResponse from './extractHttpResponse';
import { isNotServerError, isInternalServer } from '../ApiError';

export default async function(requestOptions) {
    try {
        const request = makeRequest(requestOptions);
        const response = await request.send();

        return await extractHttpResponse(response);
    } catch (error) {
        if (isNotServerError(error)) console.error(error);

        if (isInternalServer(error)) console.error('Internal server error', error);

        throw error;
    }
}
