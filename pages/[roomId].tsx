import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { PageProps, Room, Card } from '../types'
import { useUid } from '../hooks/auth'
import { useRoom } from '../hooks/room'
import { addPlayer, changeCard, open, reset, isJoined } from '../services/room'
import CreatePlayerModal from '../components/CreatePlayerModal'
import OverlaySpinner from '../components/OverlaySpinner'
import CardSelect from '../components/CardSelect'
import PokerTable from  '../components/PokerTable'

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

  const showCards = () => { open(room) }
  const voteNext = () => { reset(room) }

  return (
    <>
      <JoinModal room={room} uid={uid} />
      <div className="py-16">
        <PokerTable room={room} showCards={showCards} voteNext={voteNext} />
        { player &&
          <div className="mt-12">
            <CardSelect selected={player.card} onChange={handleChange} />
          </div>
        }
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
