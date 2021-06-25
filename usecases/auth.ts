import firebase from '../utils/firebaseClient';
import { useEffect, useState, useMemo } from 'react';
import { User } from '../types';
import { Result, loading, succeeded, failed } from '../utils/result'

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

export type CurrentUserResult = Result<User, 'NotFound'>
export function useCurrentUser (userId : string) {
  const [user, setUser] = useState<CurrentUserResult>(loading)
  const ref = useUserRef(userId)

  useEffect(() => {
    setUser(loading)

    ref.on('value', snapshot => {
      if (snapshot?.val()) {
        setUser(succeeded(snapshot.val()))
      } else {
        setUser(failed('NotFound'))
      }
    });

    return () => { ref.off() }
  }, [ref])

  return user
}

export function createUser (id : string, name : string) {
  firebase.database().ref(`users/${id}`).set({ id, name })
}

function useUserRef (userId : string) {
  return useMemo(() => firebase.database().ref('users/' + userId), [userId])
}
