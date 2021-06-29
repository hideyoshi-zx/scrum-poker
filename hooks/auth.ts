import firebase from '../services/firebase';
import { useEffect, useState } from 'react';

export function useUid () {
  const [uid, setUid] = useState<string | undefined>()
  useEffect(() => {
    firebase.auth().signInAnonymously().catch((error) => {
      console.error(`[error] Can not signin anonymouse (${error.code}:${error.message})`);
    })

    firebase.auth().onAuthStateChanged(user => {
      setUid(user?.uid)
    });
  }, [])
  return uid;
}
