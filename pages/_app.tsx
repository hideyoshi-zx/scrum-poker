import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useUserId, useCurrentUser, createUser } from '../usecases/auth'
import React, { useState } from 'react'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

function LoggedIn ({ Component, pageProps, userId } : AppProps & { userId : string }) {
  const currentUserResult = useCurrentUser(userId)
  if (currentUserResult.error === 'NotFound') return <UserForm userId={userId} />
  if (!currentUserResult.data) return <div>Loading</div>

  return (
    <div>
      <Component {...pageProps} currentUser={currentUserResult.data} />
    </div>
  )
}
