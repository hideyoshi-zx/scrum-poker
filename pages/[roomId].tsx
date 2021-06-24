import React from 'react';
import { useRouter } from 'next/router'
import { User } from '../types'
import { useRoom, joinRoom, usePlayers } from '../usecases/room'

type Props = {
  user: User;
}

export default function Home({ user }: Props) {
  const router = useRouter()
  const roomId = router.query.roomId as string
  const roomResult = useRoom(roomId)
  const joinResult = joinRoom(user, roomResult.data)
  const playersResult = usePlayers(roomResult.data)

  if (roomResult.error === 'NotFound') return(<div>NotFound</div>)
  if (joinResult.error === 'Over') return(<div>Over</div>)
  if (!roomResult.data || !joinResult.data || !playersResult.data) return(<div>Loading...</div>)

  const playersListItem = Object.values(playersResult.data).map(player =>
    <li key={player.id}>{player.id} : {player.name}</li>
  )
  const playerList = <ul>{playersListItem}</ul>
  console.log(playersResult)

  return (
    <div>
      <div>id: {roomId}</div>
      {playerList}
    </div>
  )
}
