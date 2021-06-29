import React from 'react';
import { useRouter } from 'next/router'
import { createRoom } from '../services/room';
import { PageProps } from '../types';

export default function Home(_props: PageProps) {
  const router = useRouter()

  const handleClick = async () => {
    const roomId = await createRoom()
    router.push(roomId)
  }

  return <button type="button" onClick={handleClick}>スクラムポーカーを始める</button>;
}
