import React from 'react';
import { useRouter } from 'next/router'
import { Room, User, CARDS, Card } from '../types'
import { useRoom, joinRoom, useUsers, changeCard } from '../usecases/room'

type Props = {
  user: User;
}

export default function Home(props: Props) {
  const currentUser = props.user
  const router = useRouter()
  const roomId = router.query.roomId as string
  const roomResult = useRoom(roomId)
  const joinResult = joinRoom(currentUser, roomResult.data)
  const usersResult = useUsers(roomResult.data)

  if (roomResult.error === 'NotFound') return(<div>NotFound</div>)
  if (joinResult.error === 'Over') return(<div>Over</div>)
  if (!roomResult.data || !joinResult.data || !usersResult.data) return(<div>Loading...</div>)

  const room = roomResult.data
  const usersListItem = Object.values(usersResult.data).map(user =>
    <li key={user.id}>
      {user.name}
      <YouBadge user={user} currentUser={currentUser} />
      <CardSelect room={room} user={user} currentUser={currentUser} />
    </li>
  )
  const userList = <ul>{usersListItem}</ul>

  return (
    <div>
      <div>id: {roomId}</div>
      {userList}
    </div>
  )
}

function YouBadge({ user, currentUser }: { user: User, currentUser: User }) {
  if (user.id !== currentUser.id) return null

  return <em>(You)</em>
}

function CardSelect({ room, user, currentUser }: { room: Room, user: User, currentUser: User }) {
  if (user.id !== currentUser.id) return null

  const players = room.players
  if (!players) return null

  const player = players[user.id]

  const cardOptions = CARDS.map(card =>
    <option key={card} value={card}>{card}</option>
  )

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as Card
    changeCard(room, user, value)
  }

  return <select value={player.card} onChange={handleChange}>{cardOptions}</select>
}
