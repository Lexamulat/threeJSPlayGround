import { PROCESSING, SUCCESS, FAIL } from './commonConst';

export default function parseActionSubtype(type) {
    const subtype = type
        .split('__')
        .slice(1)
        .join('__');

    return {
        subtype,

        isStart() {
            return !subtype;
        },

        isFail() {
            return subtype === FAIL;
        },

        isSuccess() {
            return subtype === SUCCESS;
        },
        isProcessing() {
            return subtype === PROCESSING;
        },
        isShow() {
            return subtype === 'SHOW';
        },

        isHide() {
            return subtype === 'HIDE';
        },

        isClean() {
            return subtype === 'CLEAN';
        },

        isDownloadProgress() {
            return subtype === 'DOWNLOAD_PROGRESS';
        },

        isUploadProgress() {
            return subtype === 'UPLOAD_PROGRESS';
        },

        isCancel() {
            return subtype === 'CANCEL';
        },
    };
}
