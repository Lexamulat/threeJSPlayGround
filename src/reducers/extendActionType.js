import { PROCESSING, SUCCESS, FAIL } from './commonConst';

export function extend(type, extension) {
    return type + '__' + extension;
}

export function success(type) {
    return extend(type, SUCCESS);
}

export function fail(type) {
    return extend(type, FAIL);
}

export function show(type) {
    return extend(type, 'SHOW');
}

export function hide(type) {
    return extend(type, 'HIDE');
}

export function clean(type) {
    return extend(type, 'CLEAN');
}

export function uploadProgress(type) {
    return extend(type, 'UPLOAD_PROGRESS');
}

export function downloadProgress(type) {
    return extend(type, 'DOWNLOAD_PROGRESS');
}

export function progress(type) {
    return extend(type, PROCESSING);
}

export function cancel(type) {
    return extend(type, 'CANCEL');
}
