import { getRequestConfig } from 'next-intl/server';
import { routing } from '@/app/i18n/routing';
import enMessages from '../../../public/locales/en/common.json';
import esMessages from '../../../public/locales/es/common.json';

const messagesByLocale = {
    en: enMessages,
    es: esMessages
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
    const requestedLocale = await requestLocale;
    const locale = routing.locales.includes(requestedLocale as any)
        ? (requestedLocale as (typeof routing.locales)[number])
        : routing.defaultLocale;

    // Validar que el locale sea soportado

    return {
        locale,
        messages: messagesByLocale[locale as keyof typeof messagesByLocale]
    };
});