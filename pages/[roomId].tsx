import React, { useState } from 'react';
import { useRouter } from 'next/router'
import { PageProps, Room, Player, CARDS, Card } from '../types'
import { useUid } from '../usecases/auth'
import { useRoom, addPlayer, changeCard, open, reset, isJoined } from '../usecases/room'

export default function Page(_props: PageProps) {
  const uid = useUid()

  if (!uid) return <div>Loading</div>

  return <LoggedIn uid={uid} />
}

function LoggedIn({ uid }: { uid: string }) {
  const router = useRouter()
  const roomId = router.query.roomId as string
  const roomResult = useRoom(roomId)

  if (roomResult.error === 'NotFound') return(<div>NotFound</div>)
  if (!roomResult.data) return(<div>Loading</div>)

  const room = roomResult.data

  if (!isJoined(room, uid)) return <JoinForm room={room} uid={uid} />

  return (
    <div>
      <div>id: {roomId}</div>
      <PlayersList uid={uid} room={room} />
      <Action room={room} />
    </div>
  )
}

function JoinForm({ room, uid }: { room: Room, uid: string }) {
  const [name, setName] = useState('')

  const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {
    addPlayer(room, uid, name)
    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={handleChange} placeholder="Input your name" />
    </form>
  )
}

function PlayersList({ uid, room }: { uid: string, room: Room }) {
  const players = room?.players || {}

  const playersListItem = Object.values(players).map(player => {
    return <PlayersListItem key={player.uid} uid={uid} room={room} player={player} />
  })

  return <ul>{playersListItem}</ul>
}

function PlayersListItem({ uid, room, player } : { uid: string, room: Room, player: Player }) {
  return <li key={player.uid}>
    {player.name}
    <YouBadge player={player} uid={uid} />
    ：
    <CardComponent room={room} player={player} uid={uid} />
  </li>
}

function YouBadge({ player, uid }: { player: Player, uid: string }) {
  if (player.uid !== uid) return null

  return <em>(You)</em>
}

function CardComponent({ room, player, uid }: { room: Room, player: Player, uid: string }) {
  if (room.open) {
    return <span>{player.card}</span>
  } else if (player.uid === uid) {
    return <CardSelect room={room} player={player} />
  } else {
    return <span>{player.card ? 'OK' : null}</span>
  }
}

function CardSelect({ room, player }: { room: Room, player: Player }) {
  const cardOptions = CARDS.map(card =>
    <option key={card} value={card}>{card}</option>
  )

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as Card
    changeCard(room.id, player.uid, value)
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
