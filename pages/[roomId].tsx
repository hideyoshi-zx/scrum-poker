import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { PageProps, Room, Player, CARDS, Card } from '../types'
import { useUid } from '../hooks/auth'
import { useRoom } from '../hooks/room'
import { addPlayer, changeCard, open, reset, isJoined } from '../services/room'
import CreatePlayerModal from '../components/CreatePlayerModal'
import OverlaySpinner from '../components/OverlaySpinner'
import CardSelect from '../components/CardSelect'

export default function Page(_props: PageProps) {
  const uid = useUid()
  const [loading, setLoading] = useState(true)

  return (
    <>
      { uid && <LoggedIn uid={uid} onLoaded={() => setLoading(false)} /> }
      <OverlaySpinner show={!uid || loading} />
    </>
  )
}

function LoggedIn({ uid, onLoaded }: { uid: string, onLoaded: () => any }) {
  const router = useRouter()
  const roomId = router.query.roomId as string
  const roomResult = useRoom(roomId)
  useEffect(() => { roomResult.data && onLoaded() }, [roomResult])

  if (roomResult.error === 'NotFound') return(<div>NotFound</div>)

  const room = roomResult.data

  if (!room) return null

  const handleChange = (card: Card) => {
    changeCard(room.id, uid, card)
  }

  const player = (room.players || {})[uid]

  return (
    <>
      <JoinModal room={room} uid={uid} />
      <div>
        <div>id: {roomId}</div>
        <PlayersList uid={uid} room={room} />
        <Action room={room} />
        { player && <CardSelect selected={player.card} onChange={handleChange} /> }
      </div>
    </>
  )
}

function JoinModal({ room, uid }: { room: Room, uid: string }) {
  const open = !isJoined(room, uid)

  const handleSubmit = async (name: string) => {
    await addPlayer(room, uid, name)
  }

  return <CreatePlayerModal open={open} onSubmit={handleSubmit} />
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
  } else {
    return <span>{player.card ? 'OK' : null}</span>
  }
}

function Action({ room }: { room: Room }) {
  if (room.open) {
    return <button onClick={() => { reset(room) }}>Reset</button>
  } else {
    return <button onClick={() => { open(room) }}>Open</button>
  }
}
