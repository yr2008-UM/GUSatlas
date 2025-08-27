'use client';

import React from 'react';
import { Button } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { increment } from '../../store/counterSlice';
import '../../../i18n';
import CounterDisplay from '../../components/CounterDisplay';

const DemoPage = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const handleClick = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
    dispatch(increment());
  };

  return (
    <div>
      <h1>demo</h1>
      <Button color="primary" onClick={handleClick}>
        {t('buttonLabel')}
      </Button>
      <CounterDisplay />
    </div>
  );
};

export default DemoPage;
