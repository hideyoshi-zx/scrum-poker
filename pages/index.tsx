import React from 'react';
import { useRouter } from 'next/router'
import { createRoom } from '../usecases/room';

type Props = {
  userId: string;
}

export default function Home(_props: Props) {
  const router = useRouter()

  const handleClick = async () => {
    const roomId = await createRoom()
    router.push(roomId)
  }

  return <button type="button" onClick={handleClick}>スクラムポーカーを始める</button>;
}
