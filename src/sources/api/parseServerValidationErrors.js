import { mapValues } from 'lodash/mapValues';
import localizeServerError from './localizeServerError';

export default function parseValidationErrors(error) {
    if (!error) return {};

    const validationErrors = parseDetails(error);

    return {
        ...validationErrors,
    };
}

function parseDetails(error) {
    return mapValues(error.details, ({ kind }, fieldKey) => ({
        key: kind,
        label: localizeServerError(kind, fieldKey),
    }));
}
