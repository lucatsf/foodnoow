// export {default} from "next-auth/middleware";
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const allowedOrigins = process.env.NEXT_NODE_ENV === 'production' 
  ? [
    'foodnoow.com.br',
    'https://foodnoow.com.br',
    'https://www.foodnoow.com.br',
    'foodnoow.vercel.app',
    'https://foodnoow-torresfelicio.vercel.app/',
    'https://foodnoow-git-main-torresfelicio.vercel.app/'
  ]
  : ['localhost:3000', 'http://localhost:3000'];

export async function middleware(req) {
  const origin = req.headers.get('origin');

  if (origin && !allowedOrigins.includes(origin)) {
    return NextResponse.redirect(null, {
      status: 403,
      statusText: 'Forbidden',
    });
  }

  const url = new URL(req.nextUrl);
  
  const onlyAuthenticated = [
    '/api/categories',
    '/api/menu-items',
    '/api/users',
  ];

  if (!onlyAuthenticated.includes(url.pathname)) {
    return NextResponse.next();
  }
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.redirect(process.env.NEXT_REDIRECT_URL);
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: [
//     '/categories',
//     '/menu-items/:path*',
//     '/menu-items/:path*',
//     '/users/:path*',
//   ]
// }