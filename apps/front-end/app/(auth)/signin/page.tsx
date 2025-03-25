import React, { Suspense } from 'react'
import { SignInForm } from './_components/SignInForm'

export default function page() {
  return <Suspense>
    <SignInForm />
  </Suspense>
}
