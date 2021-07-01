import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { createRoom } from '../services/room'
import { PageProps } from '../types'
import HeroSection from '../components/HeroSection'

export default function Home(_props: PageProps) {
  const [moving, setMoving] = useState(false)
  const router = useRouter()

  const startNewGame = async () => {
    setMoving(true)
    const roomId = await createRoom()
    await router.push(roomId)
  }

  return <HeroSection moving={moving} onClick={startNewGame} />
}
