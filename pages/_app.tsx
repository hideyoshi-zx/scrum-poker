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
  name: string
}

const useUser = (userId: string | undefined) => {
  const [user, setUser] = useState<User>()
  const ref = useMemo(() => userId && firebase.database().ref('users/' + userId), [userId])

  useEffect(() => {
    if (!ref) return

    const data = {
      name: 'Anonymouse'
    }

    ref.on('value', snapshot => {
      if (snapshot?.val()) {
        setUser(snapshot.val())
      } else {
        ref.set(data, error => {
          if (error) {
            console.error(error)
          } else {
            setUser(data)
          }
        })
      }
    });

    return () => { ref.off() }
  }, [ref])

  return user
}

function MyApp({ Component, pageProps }: AppProps) {
  const userId = useUserId()
  const user = useUser(userId)

  if (!userId || !user) return <div>Loading...</div>

  const props = { userId, ...pageProps }

  return (
    <div>
      <div>your name: {user.name}</div>
      <Component {...props} />
    </div>
  )
}
export default MyApp
