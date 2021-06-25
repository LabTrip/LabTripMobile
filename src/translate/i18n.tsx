import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import messages from '../translate/languages/index'


// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  /*en: { Ola: 'Hello!', BemVindo: 'Welcome to Labtrip', Aguarde: 'Wait...', senha: 'password', login: 'Login' },
  pt: { Ola: 'Olá!', BemVindo: 'Seja bem vindo ao Labtrip', Aguarde: 'Aguarde...', senha: 'senha', login: '' },*/

  en: messages.en.translations,
  pt: messages.pt.translations
};
// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;
// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;

export default i18n;