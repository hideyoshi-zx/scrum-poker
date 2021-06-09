import '../styles/globals.css'
import type { AppProps } from 'next/app'
import firebase from '../lib/firebaseClient';
import React, { useEffect, useState } from 'react';

const useUserId = () => {
  const [userId, setUserId] = useState<string | null>()
  useEffect(() => {
    firebase.auth().signInAnonymously().catch((error) => {
      console.error(`[error] Can not signin anonymouse (${error.code}:${error.message})`);
    })

    firebase.auth().onAuthStateChanged(user => {
      setUserId(user?.uid)
    });
  }, [])
  return userId;
}

function MyApp({ Component, pageProps }: AppProps) {
  const userId = useUserId()

  if (!userId) return <div>Loading...</div>

  const props = { userId, ...pageProps }

  return <Component {...props} />
}
export default MyApp
