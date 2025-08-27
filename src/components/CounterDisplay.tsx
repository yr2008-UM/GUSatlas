'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const CounterDisplay = () => {
  const count = useSelector((state: RootState) => state.counter.count);

  return (
    <div>
      <p>Count: {count}</p>
    </div>
  );
};

export default CounterDisplay;