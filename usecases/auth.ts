import firebase from '../utils/firebaseClient';
import { useEffect, useState, useMemo } from 'react';
import { User } from '../types';

export function useCurrentUser () {
  const [user, setUser] = useState<User>()
  const userId = useUserId()
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

export function useUserId () {
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
