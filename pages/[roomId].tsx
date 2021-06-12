import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router'
import firebase from '../lib/firebaseClient';

type User = {
  id: string
  name: string
}

type Room = {
  id: string;
  users: { [key:string] : true };
}

type Props = {
  user: User;
}

type State<T, U> = {
  data: T | undefined,
  error: U | undefined
}
const loadingState = { data: undefined, error: undefined }
const dataState = (data: any) => ({ data, error: undefined })
const errorState = (error: any) => ({ data: undefined, error })

const useRoomRef = (roomId: string | string[] | undefined) => {
  return useMemo(() => firebase.database().ref('rooms/' + roomId), [roomId])
}

const useRoom = (ref: firebase.database.Reference) => {
  const [room, setRoom] = useState<State<Room, 'NotFound'>>({ data: undefined, error: undefined })

  useEffect(() => {
    if (!ref) return

    ref.on('value', snapshot => {
      if (snapshot?.val()) {
        setRoom(dataState(snapshot.val()))
      } else {
        setRoom(errorState('NotFound'))
      }
    });

    return () => { ref.off() }
  }, [ref])

  return room
}

const useIsJoined = (user: User, room: Room | undefined) => {
  const [isJoined, setIsJoined] = useState<State<boolean, 'Over'>>(loadingState)

  useEffect(() => {
    if (!room) return setIsJoined(loadingState)
    if (room.users && room.users[user.id]) return setIsJoined(dataState(true))
    if (room.users && Object.keys(room.users).length >= 8) return setIsJoined(errorState('Over'))

    firebase.database().ref(`rooms/${room.id}/users/${user.id}`).set({
      card: 'blank'
    })
  }, [user, room])

  return isJoined
}

export default function Home({ user }: Props) {
  const router = useRouter()
  const { roomId } = router.query
  const roomRef = useRoomRef(roomId)
  const room = useRoom(roomRef)
  const isJoined = useIsJoined(user, room.data)

  if (room.error === 'NotFound') return(<div>NotFound</div>)
  if (isJoined.error === 'Over') return(<div>Over</div>)
  if (!room.data || !isJoined.data) return(<div>Loading...</div>)

  return(<div>isJoined: { isJoined.data ? 'true' : 'false' }</div>)
}
