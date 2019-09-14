import languageMap from '../locale/en';

export default function(key, field) {
    const fieldKey = `${key}-${field}`;
    const value = languageMap[fieldKey] || languageMap[key];

    if (!key) return '';
    if (!value) console.error(`Cannot find text for <${fieldKey}> or <${key}> key`);

    return value;
}
