import firebase from '../utils/firebaseClient';
import { useEffect, useState, useMemo } from 'react';
import { User } from '../types';

export function useUser (userId: string) {
  const [user, setUser] = useState<User | null>(null)
  const ref = useUserRef(userId)

  useEffect(() => {
    ref.on('value', snapshot => {
      if (snapshot?.val()) {
        setUser(snapshot.val())
      }
    });

    return () => { ref.off() }
  }, [ref])

  return user
}

function useUserRef (userId: string) {
  return useMemo(() => firebase.database().ref('users/' + userId), [userId])
}
