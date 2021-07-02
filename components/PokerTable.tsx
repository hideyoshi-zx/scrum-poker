import React from 'react'
import Button from '../components/elements/Button'
import { EyeIcon, RefreshIcon } from '@heroicons/react/outline'
import { Room, Player } from '../types'

type Props = {
  room: Room
  showCards: () => any
  voteNext: () => any
}

export default function CardSelect ({ room, showCards, voteNext }: Props) {
  const players = Object.values(room.players || {})

  return (
    <Container>
      <div className="relative h-full w-full flex flex-col justify-between items-stretch">
        <div className="flex justify-center space-x-8">
          <PlayerBox room={room} player={players[0]} />
          <PlayerBox room={room} player={players[6]} />
          <PlayerBox room={room} player={players[2]} />
        </div>
        <div className="flex justify-between">
          <PlayerBox room={room} player={players[4]} />
          <PlayerBox room={room} player={players[5]} />
        </div>
        <div className="flex justify-center space-x-8">
          <PlayerBox room={room} player={players[1]} />
          <PlayerBox room={room} player={players[7]} />
          <PlayerBox room={room} player={players[3]} />
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-md shadow">
          <ActionButton room={room} showCards={showCards} voteNext={voteNext} />
        </div>
      </div>
    </Container>
  )
}

function PlayerBox ({ room, player }: { room: Room, player: Player | undefined }) {
  if (!player) return null

  return (
    <div className="w-24">
      <PlayerCard room={room} player={player} />
      <div className="mt-1 mx-auto px-2 w-min text-center truncate text-gray-500 font-bold">
        { player.name }
      </div>
    </div>
  )
}

function PlayerCard ({ room, player }: { room: Room, player: Player }) {
  const baseClass = 'mx-auto flex items-center justify-center h-14 w-10 text-lg font-bold rounded'

  if (!player.card) {
    return (
      <div className={`${baseClass} bg-gray-100 border-2 border-dashed border-gray-300`}>
      </div>
    )
  }

  if (room.open) {
    return (
      <div className={`${baseClass} shadow-sm border-2 border-blue-100 text-blue-500 bg-blue-50`}>
        { player.card }
      </div>
    )
  } else {
    return (
      <div className={`${baseClass} shadow-sm border border-white bg-blue-400 heropattern-diagonallines-blue-500`}>
      </div>
    )
  }
}

function ActionButton ({ room, showCards, voteNext }: { room: Room, showCards: () => any, voteNext: () => any }) {
  if (room.open) {
    return (
      <Button onClick={voteNext} variant="secondary">
        <RefreshIcon className="h-5 w-5 text-blue-500 mr-2" aria-hidden="true" />
        Vote next
      </Button>
    )
  } else {
    const players = Object.values(room.players || {})
    const disabled = players.every(player => !player.card)
    return (
      <Button onClick={showCards} variant="primary" disabled={disabled}>
        <EyeIcon className="h-5 w-5 text-gray-200 mr-2" aria-hidden="true" />
        Show Cards
      </Button>
    )
  }
}

function Container (props: { children: React.ReactNode }) {
  const containerStyle = {
    height: '24rem',
    width: '40rem',
  }

  const bgStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='52' height='52' viewBox='0 0 52 52'%3E%3Cpath fill='rgb(249, 250, 251)' fill-opacity='0.5' d='M0 17.83V0h17.83a3 3 0 0 1-5.66 2H5.9A5 5 0 0 1 2 5.9v6.27a3 3 0 0 1-2 5.66zm0 18.34a3 3 0 0 1 2 5.66v6.27A5 5 0 0 1 5.9 52h6.27a3 3 0 0 1 5.66 0H0V36.17zM36.17 52a3 3 0 0 1 5.66 0h6.27a5 5 0 0 1 3.9-3.9v-6.27a3 3 0 0 1 0-5.66V52H36.17zM0 31.93v-9.78a5 5 0 0 1 3.8.72l4.43-4.43a3 3 0 1 1 1.42 1.41L5.2 24.28a5 5 0 0 1 0 5.52l4.44 4.43a3 3 0 1 1-1.42 1.42L3.8 31.2a5 5 0 0 1-3.8.72zm52-14.1a3 3 0 0 1 0-5.66V5.9A5 5 0 0 1 48.1 2h-6.27a3 3 0 0 1-5.66-2H52v17.83zm0 14.1a4.97 4.97 0 0 1-1.72-.72l-4.43 4.44a3 3 0 1 1-1.41-1.42l4.43-4.43a5 5 0 0 1 0-5.52l-4.43-4.43a3 3 0 1 1 1.41-1.41l4.43 4.43c.53-.35 1.12-.6 1.72-.72v9.78zM22.15 0h9.78a5 5 0 0 1-.72 3.8l4.44 4.43a3 3 0 1 1-1.42 1.42L29.8 5.2a5 5 0 0 1-5.52 0l-4.43 4.44a3 3 0 1 1-1.41-1.42l4.43-4.43a5 5 0 0 1-.72-3.8zm0 52c.13-.6.37-1.19.72-1.72l-4.43-4.43a3 3 0 1 1 1.41-1.41l4.43 4.43a5 5 0 0 1 5.52 0l4.43-4.43a3 3 0 1 1 1.42 1.41l-4.44 4.43c.36.53.6 1.12.72 1.72h-9.78zm9.75-24a5 5 0 0 1-3.9 3.9v6.27a3 3 0 1 1-2 0V31.9a5 5 0 0 1-3.9-3.9h-6.27a3 3 0 1 1 0-2h6.27a5 5 0 0 1 3.9-3.9v-6.27a3 3 0 1 1 2 0v6.27a5 5 0 0 1 3.9 3.9h6.27a3 3 0 1 1 0 2H31.9z'%3E%3C/path%3E%3C/svg%3E")`,
  }

  return (
    <div className="relative mx-auto" style={containerStyle}>
      <div className="absolute inset-0" style={{ zIndex: -1, padding: '6rem' }}>
        <div className="h-full w-full rounded-full bg-white shadow-sm p-4">
          <div className="bg-gray-100 h-full w-full rounded-full shadow-inner" style={bgStyle}>
          </div>
        </div>
      </div>
      {props.children}
    </div>
  )
}
