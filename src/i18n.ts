import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import translationENG from 'locales/en.json';
import translationId from 'locales/id.json';

const resources = {
	id: {
		translation: translationId,
	},
	en: {
		translation: translationENG,
	},
};

const language = localStorage.getItem('I18N_LANGUAGE');
if (!language) {
	localStorage.setItem('I18N_LANGUAGE', 'id');
}

i18n
	.use(detector)
	.use(initReactI18next)
	.init({
		resources,
		lng: localStorage.getItem('I18N_LANGUAGE') || 'id',
		fallbackLng: 'id',

		keySeparator: false,

		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
