import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './app/i18n/routing';

const intlMiddleware = createMiddleware(routing);



export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 2. Tu lógica personalizada: Redirigir la raíz '/' a '/sign-in'
  // Nota: Al usar next-intl, la raíz '/' suele ser interceptada para añadir el locale.
  // Si quieres que vaya a sign-in conservando el idioma, hacemos esto:
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // 3. Ejecutar la lógica de next-intl para el resto de rutas
  return intlMiddleware(request);
}

export const config = {
  // Ajustamos el matcher para que no afecte a archivos estáticos ni APIs
  // pero sí intercepte todas las rutas de la app
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};