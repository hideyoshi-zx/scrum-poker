import React from 'react';
import { useRouter } from 'next/router'
import firebase from '../lib/firebaseClient';
import { nanoid } from 'nanoid'

type Props = {
  userId: string;
}

export default function Home(_props: Props) {
  const router = useRouter()

  const createRoom = () => {
    const roomId = nanoid(10)
    firebase.database().ref('rooms/' + roomId).set({
      id: roomId,
    })
    router.push(roomId)
  }

  return <button type="button" onClick={createRoom}>スクラムポーカーを始める</button>;
}
