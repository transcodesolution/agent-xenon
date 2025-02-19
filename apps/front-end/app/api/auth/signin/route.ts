import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    //need to add one more layer of validation here
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'email and password are required' },
        { status: 400 }
      )
    }

    //logic will be as follow
    // 1. call the rest api for login
    // 2. get the token from the response
    // 3. set the token in cookie
    
    const cookieStore = await cookies();
    cookieStore.set('agentXenonToken', 'new-token-is-set');

    return NextResponse.json({
      message: 'You Are Logged In Successfully',
      data: { name: 'shubham' }
    }, { status: 201 })

  } catch (error) {
    console.log(error, 'Error While Signin')
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    )
  }
}