import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { signIn } from '@/libs/web-apis/src';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Organization Name is required' },
        { status: 400 }
      );
    }

    const result = await signIn({ name, email, password });

    if (result.status === 200) {
      const cookieStore = await cookies();
      cookieStore.set('agentXenonToken', result.data.token, { path: '/' });

      const redirectUrl = new URL('/', request.url);
      console.log(redirectUrl, 'redirectUrl')
      return NextResponse.redirect(redirectUrl);

    } else {
      return NextResponse.json(
        { error: 'Error while signing in' },
        { status: result.status }
      );
    }
  } catch (error) {
    console.error('Error during sign-in:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}