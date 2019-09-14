import parseActionSubype from './parseActionSubtype';

export function requestHandler(targetKey, options = {}) {
    const helper = new RequestReducerHelper(targetKey, options);

    const reduce = (state, action) => helper.getNextState(state, action);
    reduce.exec = reduce;

    return reduce;
}

export default class RequestReducerHelper {
    constructor(targetKey, options = {}) {
        this.resultKey = options.resultKey || targetKey;
        this.processingKey = options.processingKey || targetKey + 'Processing';
        this.errorKey = options.errorKey || targetKey + 'Error';
        this.displayedKey = options.displayedKey || targetKey + 'Displayed';

        this.downloadProgressKey = options.downloadProgressKey || targetKey + 'DownloadProgress';
        this.downloadPercentKey = options.downloadPercentKey || targetKey + 'DownloadPercent';
        this.uploadProgressKey = options.uploadProgressKey || targetKey + 'UploadProgress';
        this.uploadPercentKey = options.uploadPercentKey || targetKey + 'UploadPercent';

        this.clearResultOnProgress = !options.notClearResultOnProgress;
    }

    getNextState(state, action) {
        this.nextState = { ...state };
        this.action = action;
        const actionSubType = parseActionSubype(action.type);

        if (actionSubType.isShow()) this._formShowState();
        else if (actionSubType.isHide()) this._formHideState();
        else if (actionSubType.isDownloadProgress()) this._formDownloadProgressState();
        else if (actionSubType.isUploadProgress()) this._formUploadProgressState();
        else if (actionSubType.isCancel()) this._formCancelState();
        else if (actionSubType.isClean()) this._formCleanState();
        else if (actionSubType.isSuccess()) this._formResultState();
        else if (actionSubType.isFail()) this._formErrorState();
        else this._formProcessingState();

        return this.nextState;
    }

    _formShowState() {
        this.nextState[this.displayedKey] = true;
        delete this.nextState[this.processingKey];
        delete this.nextState[this.errorKey];
    }

    _formHideState() {
        delete this.nextState[this.displayedKey];
        delete this.nextState[this.processingKey];
        delete this.nextState[this.errorKey];
    }

    _formCleanState() {
        delete this.nextState[this.displayedKey];
        delete this.nextState[this.processingKey];
        delete this.nextState[this.resultKey];
        delete this.nextState[this.errorKey];

        delete this.nextState[this.downloadProgressKey];
        delete this.nextState[this.downloadPercentKey];
        delete this.nextState[this.uploadProgressKey];
        delete this.nextState[this.uploadPercentKey];
    }

    _formResultState() {
        delete this.nextState[this.processingKey];
        this.nextState[this.resultKey] = this.action.result;
        delete this.nextState[this.errorKey];
    }

    _formErrorState() {
        delete this.nextState[this.processingKey];
        delete this.nextState[this.resultKey];
        this.nextState[this.errorKey] = this.action.error;
    }

    _formProcessingState() {
        this.nextState[this.processingKey] = true;

        if (this.clearResultOnProgress) delete this.nextState[this.resultKey];
        delete this.nextState[this.errorKey];
    }

    _formDownloadProgressState() {
        this.nextState[this.downloadProgressKey] = this.action.progress;
        this.nextState[this.downloadPercentKey] = this.action.percent;
    }

    _formUploadProgressState() {
        this.nextState[this.uploadProgressKey] = this.action.progress;
        this.nextState[this.uploadPercentKey] = this.action.percent;
    }

    _formCancelState() {
        delete this.nextState[this.processingKey];
        delete this.nextState[this.resultKey];
        delete this.nextState[this.errorKey];
    }
}
