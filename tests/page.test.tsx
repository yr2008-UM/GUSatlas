import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import DemoPage from '../src/app/page';

test('renders page correctly', () => {
    render(
        <I18nextProvider i18n={i18n}>
            <DemoPage />
        </I18nextProvider>
    );
    const buttonElement = screen.getByText(/点击切换为英文/i);
    expect(buttonElement).toBeInTheDocument();
});

test('button label changes on click', () => {
    render(
        <I18nextProvider i18n={i18n}>
            <DemoPage />
        </I18nextProvider>
    );
    const buttonElement = screen.getByText(/点击切换为英文/i);
    fireEvent.click(buttonElement);
    expect(screen.getByText(/Click to switch to Chinese/i)).toBeInTheDocument();
    fireEvent.click(buttonElement);
    expect(screen.getByText(/点击切换为英文/i)).toBeInTheDocument();
});

test('1 + 1 should not equal 3', () => {
    expect(1 + 1).not.toBe(3);
});