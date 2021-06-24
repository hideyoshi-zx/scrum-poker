import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useUser } from '../usecases/auth'
import React from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  const user = useUser()

  if (!user) return <div>Loading...</div>

  const props = { user, ...pageProps }

  return (
    <div>
      <Component {...props} />
    </div>
  )
}
export default MyApp
