import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { signIn } from '@agent-xenon/web-apis';
import { ISignInRequest } from '@agent-xenon/types-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, userType } = body;

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

    const signInData: ISignInRequest = { name, email, password, userType };

    const result = await signIn(signInData);

    if (result.status === 200) {
      const cookieStore = await cookies();
      cookieStore.set('agentXenonToken', result.data.token, { httpOnly: true });

      return NextResponse.json({ status: result.status });

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