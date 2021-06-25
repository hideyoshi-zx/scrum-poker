import React from 'react';
import { useRouter } from 'next/router'
import { PageProps, Room, Player, User, CARDS, Card } from '../types'
import { useRoom, useJoin, changeCard, open, reset } from '../usecases/room'
import { useUser } from '../usecases/user'

export default function Page({ currentUser }: PageProps) {
  const router = useRouter()
  const roomId = router.query.roomId as string
  const roomResult = useRoom(roomId)
  // const joinResult = joinRoom(currentUser, roomResult.data)

  if (roomResult.error === 'NotFound') return(<div>NotFound</div>)
  if (!roomResult.data) return(<div>Loading</div>)

  const room = roomResult.data
  const players = room.players || {}
  const isJoined = players[currentUser.id]

  if (!isJoined) return <Joining currentUser={currentUser} room={room} />

  return (
    <div>
      <div>id: {roomId}</div>
      <UsersList currentUser={currentUser} room={room} />
      <Action room={room} />
    </div>
  )
}

function Joining({ currentUser, room }: { currentUser: User, room: Room }) {
  const joinResult = useJoin(currentUser, room)

  if (joinResult.error === 'Over') return <div>Over</div>

  return <div>Joining</div>
}

function UsersList({ currentUser, room }: { currentUser: User, room: Room }) {
  const players = room?.players || {}

  const usersListItem = Object.values(players).map(player => {
    return <UserListItem key={player.id} currentUser={currentUser} room={room} player={player} />
  })

  return <ul>{usersListItem}</ul>
}

function UserListItem({ currentUser, room, player } : { currentUser: User, room: Room, player: Player }) {
  const user = useUser(player.id)

  if (!user) return null

  return <li key={user.id}>
    {user.name}
    <YouBadge user={user} currentUser={currentUser} />
    :
    <CardComponent room={room} player={player} currentUser={currentUser} />
  </li>
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
