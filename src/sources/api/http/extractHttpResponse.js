export default function(response) {
    if (isSuccess(response)) {
        if (response.body) {
            return Promise.resolve(response.body);
        }
        return Promise.resolve(response.text);
    } else {
        const error = new Error(response.result);

        error.code = response.code;
        error.details = response.details;
        error.message = response.message;

        if (error) {
            return Promise.reject(error);
        }
        return Promise.reject(new Error('Broken http server response'));
    }
    // if (!response || response.status === 'error') {
    //     // const error = new Error(response.error);
    //     const error = new Error(response.result);

    //     error.code = response.code;
    //     error.details = response.details;
    //     error.message = response.message;

    //     return Promise.reject(error);
    // }

    // return Promise.reject(new Error('Broken http server response'));
}

function isSuccess(responce) {
    if (
        (responce && responce.status == 200 && responce.body) ||
        (responce && responce.status == 200 && responce.text)
    ) {
        return true;
    }
    return false;
}
