import firebase from '../utils/firebaseClient';
import { useState, useEffect, useMemo } from 'react';
import { nanoid } from 'nanoid'
import { User, Room } from '../types'
import { Result, loading, succeeded, failed } from '../utils/result'

export function createRoom (): Promise<string> {
  const roomId = nanoid(10)

  return new Promise((resolve, reject) => {
    firebase.database().ref('rooms/' + roomId).set({
      id: roomId,
    }, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve(roomId)
      }
    })
  })
}

export type RoomResult = Result<Room, 'NotFound'>

export function useRoom (roomId: string) {
  const [roomResult, setRoomResult] = useState<RoomResult>(loading)
  const ref = useRoomRef(roomId)

  useEffect(() => {
    if (!ref) return

    ref.on('value', snapshot => {
      if (snapshot?.val()) {
        setRoomResult(succeeded(snapshot.val()))
      } else {
        setRoomResult(failed('NotFound'))
      }
    });

    return () => { ref.off() }
  }, [roomId])

  return roomResult
}

export function useRoomRef (roomId: string) {
  return useMemo(() => firebase.database().ref('rooms/' + roomId), [roomId])
}

export type JoinResult = Result<true, 'Over'>

export function joinRoom (user: User, room: Room | undefined) {
  const [result, setResult] = useState<JoinResult>(loading)

  useEffect(() => {
    if (!room) return setResult(loading)
    if (isJoined(user, room)) return setResult(succeeded(true))
    if (isOver(room)) return setResult(failed('Over'))

    firebase.database().ref(`rooms/${room.id}/users/${user.id}`).set({
      card: 'blank'
    })
  }, [user, room])

  return result
}

function isJoined (user: User, room: Room) {
  return room.users && room.users[user.id]
}

function isOver (room: Room) {
  return room.users && Object.keys(room.users).length >= 8
}
