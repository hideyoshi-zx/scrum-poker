import firebase from '../utils/firebaseClient';
import { useState, useEffect, useMemo } from 'react';
import { nanoid } from 'nanoid'
import { User, Room, Card } from '../types'
import { Result, loading, succeeded, failed } from '../utils/result'

export function createRoom (): Promise<string> {
  const roomId = nanoid(10)

  return new Promise((resolve, reject) => {
    firebase.database().ref('rooms/' + roomId).set({
      id: roomId,
      open: false,
    }, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve(roomId)
      }
    })
  })
}

export function changeCard (roomId: string, userId: string, card: Card): Promise<true> {
  return new Promise((resolve, reject) => {
    firebase.database().ref(`rooms/${roomId}/players/${userId}/card`).set(card, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve(true)
      }
    })
  })
}

export function open (room: Room) {
  return new Promise((resolve, reject) => {
    firebase.database().ref(`rooms/${room.id}/open`).set(true, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve(true)
      }
    })
  })
}

export function reset (room: Room) {
  const playersUpdates = Object.keys(room?.players || {}).reduce((map, playerId) => {
    map[`/players/${playerId}/card`] = ''
    return map
  }, {} as { [key:string]: string })

  const updates = {
    '/open': false,
    ...playersUpdates
  }
  return new Promise((resolve, reject) => {
    firebase.database().ref(`rooms/${room.id}`).update(updates, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve(true)
      }
    })
  })
}

export type RoomResult = Result<Room, 'NotFound'>

export function useRoom (roomId: string) {
  const [roomResult, setRoomResult] = useState<RoomResult>(loading)
  const ref = useRoomRef(roomId)

  useEffect(() => {
    setRoomResult(loading)
    if (!ref) return

    ref.on('value', snapshot => {
      if (snapshot?.val()) {
        setRoomResult(succeeded(snapshot.val()))
      } else {
        setRoomResult(failed('NotFound'))
      }
    });

    return () => { ref.off() }
  }, [ref])

  return roomResult
}

export type JoinResult = Result<true, 'Over'>

export function useJoin (user: User, room: Room) {
  const [result, setResult] = useState<JoinResult>(loading)

  useEffect(() => {
    if (isOver(room)) return setResult(failed('Over'))

    firebase.database().ref(`rooms/${room.id}/players/${user.id}`).set({
      id: user.id,
      card: '',
    })
  }, [user.id, room.id])

  return result
}

function useRoomRef (roomId: string) {
  return useMemo(() => firebase.database().ref('rooms/' + roomId), [roomId])
}

function isOver (room: Room) {
  return room.players && Object.keys(room.players).length >= 8
}
