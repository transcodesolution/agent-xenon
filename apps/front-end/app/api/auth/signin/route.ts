import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { signIn } from '@agent-xenon/web-apis';
import { ISignInRequest } from '@agent-xenon/types-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, candidateToken, redirectUrl } = body;

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

    const signInData: ISignInRequest = { name, email, password };
    if (candidateToken) signInData.candidateToken = candidateToken;
    const result = await signIn(signInData);

    if (result.status === 200) {
      const cookieStore = await cookies();
      if (!candidateToken) {
        cookieStore.set('agentXenonToken', result.data.token, { path: '/', httpOnly: true });
      } else {
        cookieStore.set('agentXenonApplicantToken', result.data.token, { path: redirectUrl ?? '/', httpOnly: true });
      }
      const redirectTo = new URL(redirectUrl ?? '/', request.url);
      return NextResponse.redirect(redirectTo);

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