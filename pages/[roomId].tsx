import React from 'react';
import { useRouter } from 'next/router'
import { User } from '../types'
import { useRoom, joinRoom } from '../usecases/room'

type Props = {
  user: User;
}

export default function Home({ user }: Props) {
  const router = useRouter()
  const roomId = router.query.roomId as string
  const roomResult = useRoom(roomId)
  const joinResult = joinRoom(user, roomResult.data)

  if (roomResult.error === 'NotFound') return(<div>NotFound</div>)
  if (joinResult.error === 'Over') return(<div>Over</div>)
  if (roomResult.isLoading || joinResult.isLoading) return(<div>Loading...</div>)

  return(<div>id: {roomId}</div>)
}
