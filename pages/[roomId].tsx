import React from 'react';
import { useRouter } from 'next/router'
import { User } from '../types'
import { useRoom, joinRoom, useUsers } from '../usecases/room'

type Props = {
  user: User;
}

export default function Home({ user }: Props) {
  const router = useRouter()
  const roomId = router.query.roomId as string
  const roomResult = useRoom(roomId)
  const joinResult = joinRoom(user, roomResult.data)
  const usersResult = useUsers(roomResult.data)

  if (roomResult.error === 'NotFound') return(<div>NotFound</div>)
  if (joinResult.error === 'Over') return(<div>Over</div>)
  if (!roomResult.data || !joinResult.data || !usersResult.data) return(<div>Loading...</div>)

  const usersListItem = Object.values(usersResult.data).map(user =>
    <li key={user.id}>{user.id} : {user.name}</li>
  )
  const userList = <ul>{usersListItem}</ul>

  return (
    <div>
      <div>id: {roomId}</div>
      {userList}
    </div>
  )
}
