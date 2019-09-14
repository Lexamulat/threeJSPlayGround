export function isValidationError(error) {
    return codeEqualsTo(error, 400);
}

function codeEqualsTo(error, code) {
    return error.code === code;
}

export function isUnauthorizeError(error) {
    return codeEqualsTo(error, 401);
}

export function isForbiddenError(error) {
    return codeEqualsTo(error, 403);
}

export function isNotFound(error) {
    return codeEqualsTo(error, 404);
}

export function isInternalServer(error) {
    return codeEqualsTo(error, 500);
}

export function isNotServerError(error) {
    return !error.code;
}
