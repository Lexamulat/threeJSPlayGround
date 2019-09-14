import _ from 'lodash';
import en from './en';
import ru from './ru';

export const LOCALES = {
    EN: 'en',
    RU: 'ru',
};

export function initLocale() {
    window.loc = loc;
    var language = window.navigator
        ? window.navigator.language || window.navigator.systemLanguage || window.navigator.userLanguage
        : 'en';
    language = language.substr(0, 2).toLowerCase();

    window.__changeLocale = changeLocale;
    window.localeMap = {
        en,
        ru,
    };

    const translations = getLocaleFromStorage();

    window.locale = translations ? translations : LOCALES.EN;
}

export function getLocaleFromStorage() {
    return localStorage.getItem('translations');
}

function loc(key) {
    return _.get(window.localeMap, `${window.locale}.${key}`, '');
}

export function injectToLocaleMap(localeData) {
    const { locale, localeNode, localeCode } = localeData;

    if (localeNode) _.set(window.localeMap, `${localeCode}.${localeNode}`, locale);
    else
        window.localeMap[localeCode] = {
            ...window.localeMap[localeCode],
            ...locale,
        };
}

export function changeLocale(localeCode) {
    window.locale = localeCode;
    localStorage.setItem('translations', localeCode);
    location.reload();
}
