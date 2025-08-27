import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      buttonLabel: 'Click to switch to Chinese',
    },
  },
  zh: {
    translation: {
      buttonLabel: '点击切换为英文',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'zh', // 默认语言
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
