import '../styles/globals.css'
import type { AppProps } from 'next/app'
import firebase from '../lib/firebaseClient';
import React, { useEffect, useState, useMemo } from 'react';

const useUserId = () => {
  const [userId, setUserId] = useState<string | undefined>()
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

type User = {
  id: string
  name: string
}

const useUser = (userId: string | undefined) => {
  const [user, setUser] = useState<User>()
  const ref = useMemo(() => userId && firebase.database().ref('users/' + userId), [userId])

  useEffect(() => {
    if (!ref) return

    const data = {
      id: userId,
      name: 'Anonymouse',
    }

    ref.on('value', snapshot => {
      if (snapshot?.val()) {
        setUser(snapshot.val())
      } else {
        ref.set(data)
      }
    });

    return () => { ref.off() }
  }, [ref])

  return user
}

function MyApp({ Component, pageProps }: AppProps) {
  const userId = useUserId()
  const user = useUser(userId)

  if (!user) return <div>Loading...</div>

  const props = { user, ...pageProps }

  return (
    <div>
      <Component {...props} />
    </div>
  )
}
export default MyApp
