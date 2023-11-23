import { NextResponse } from 'next/server';

export const response = (data, { req, res, next}) => {
  const origin = req?.headers?.get('origin');
  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Content-Type': 'application/json',
    }
  });
}