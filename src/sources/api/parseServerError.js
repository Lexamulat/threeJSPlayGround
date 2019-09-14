import _ from 'lodash';
import parseServerValidationErrors from './parseServerValidationErrors';

export default function(error) {
    return _.get(parseServerValidationErrors(error), 'common.label');
}

export function parseServerErrorKey(error) {
    return _.get(parseServerValidationErrors(error), 'common.key');
}
