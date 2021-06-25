import React from 'react';
import { useRouter } from 'next/router'
import { Room, Player, User, CARDS, Card } from '../types'
import { useRoom, joinRoom, useUsers, changeCard, open, reset, Users } from '../usecases/room'

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
  return (
    <div>
      <div>id: {roomId}</div>
      <UsersList currentUser={currentUser} room={room} users={usersResult.data} />
      <Action room={room} />
    </div>
  )
}

function UsersList({ currentUser, room, users }: { currentUser: User, room: Room, users: Users }) {
  const players = room?.players || []
  const usersListItem = Object.values(players).map(player => {
    const user = users[player.id]

    return <li key={user.id}>
      {user.name}
      <YouBadge user={user} currentUser={currentUser} />
      :
      <CardComponent room={room} player={player} currentUser={currentUser} />
    </li>
  })

  return <ul>{usersListItem}</ul>
}

function YouBadge({ user, currentUser }: { user: User, currentUser: User }) {
  if (user.id !== currentUser.id) return null

  return <em>(You)</em>
}

function CardComponent({ room, player, currentUser }: { room: Room, player: Player, currentUser: User }) {
  if (room.open) {
    return <span>{player.card}</span>
  } else if (player.id === currentUser.id) {
    return <CardSelect room={room} player={player} />
  } else {
    return null
  }
}

function CardSelect({ room, player }: { room: Room, player: Player }) {
  const cardOptions = CARDS.map(card =>
    <option key={card} value={card}>{card}</option>
  )

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as Card
    changeCard(room.id, player.id, value)
  }

  return <select value={player.card} onChange={handleChange}>{cardOptions}</select>
}

function Action({ room }: { room: Room }) {
  if (room.open) {
    return <button onClick={() => { reset(room) }}>Reset</button>
  } else {
    return <button onClick={() => { open(room) }}>Open</button>
  }
}
