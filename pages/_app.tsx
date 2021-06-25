import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useCurrentUser } from '../usecases/auth'
import React from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  const currentUser = useCurrentUser()

  if (!currentUser) return <div>Loading...</div>

  const props = { currentUser, ...pageProps }

  return (
    <div>
      <Component {...props} />
    </div>
  )
}
export default MyApp
