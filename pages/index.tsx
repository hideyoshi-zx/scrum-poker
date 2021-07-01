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

  // return <button type="button" onClick={handleClick}>スクラムポーカーを始める</button>;

  return (
    <button
      onClick={handleClick}
      type="button"
      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      スクラムポーカーを始める
    </button>
  )
}
