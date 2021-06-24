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
  }, [roomId])

  return roomResult
}

export type JoinResult = Result<true, 'Over'>

export function joinRoom (user: User, room: Room | undefined) {
  const [result, setResult] = useState<JoinResult>(loading)

  useEffect(() => {
    if (!room) return setResult(loading)
    if (isJoined(user, room)) return setResult(succeeded(true))
    if (isOver(room)) return setResult(failed('Over'))

    firebase.database().ref(`rooms/${room.id}/players/${user.id}`).set({
      card: 'blank'
    })
  }, [user, room])

  return result
}

export type Players = { [key:string] : User }
export type PlayersResult = Result<Players, undefined>

export function usePlayers (room: Room | undefined) {
  const [result, setResult] = useState<PlayersResult>(loading)

  const players = room?.players

  const refs =  useMemo(() => {
    if (!players) return []

    return Object.keys(players).map(id =>
      firebase.database().ref('users/' + id)
    )
  }, [players])

  useEffect(() => {
    setResult(loading)

    const promises = refs.map((ref): Promise<User> => {
      return new Promise((resolve, reject) => {
        ref.on('value', snapshot => {
          if (snapshot?.val()) {
            resolve(snapshot.val())
          } else {
            reject()
          }
        })
      })
    })

    Promise.all(promises).then((users: User[]) => {
      const players = users.reduce((map, user) => {
        map[user.id] = user
        return map
      }, {} as { [key:string] : User })

      setResult(succeeded(players))
    })

    return () => { refs.forEach(ref => ref.off()) }
  }, [refs])

  return result
}

function useRoomRef (roomId: string) {
  return useMemo(() => firebase.database().ref('rooms/' + roomId), [roomId])
}

function isJoined (user: User, room: Room) {
  return room.players && room.players[user.id]
}

function isOver (room: Room) {
  return room.players && Object.keys(room.players).length >= 8
}
