import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // 1. La lista maestra de idiomas
    locales: ['en', 'es'],

    // 2. El idioma que se usará si el usuario entra a una ruta sin idioma
    defaultLocale: 'es'
});

// 3. Esto es para que puedas usar <Link />, useRouter() y usePathname() 
// que pongan el idioma automáticamente en la URL.
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);