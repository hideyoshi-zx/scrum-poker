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
    }, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve(roomId)
      }
    })
  })
}

export function changeCard (room: Room, user: User, card: Card): Promise<true> {
  return new Promise((resolve, reject) => {
    firebase.database().ref(`rooms/${room.id}/players/${user.id}/card`).set(card, (error) => {
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

export function joinRoom (user: User, room: Room | undefined) {
  const [result, setResult] = useState<JoinResult>(loading)

  useEffect(() => {
    if (!room) return setResult(loading)
    if (isJoined(user, room)) return setResult(succeeded(true))
    if (isOver(room)) return setResult(failed('Over'))

    firebase.database().ref(`rooms/${room.id}/players/${user.id}`).set({
      card: ''
    })
  }, [user, room])

  return result
}

export type Users = { [key:string] : User }
export type UsersResult = Result<Users, undefined>

export function useUsers (room: Room | undefined) {
  const [result, setResult] = useState<UsersResult>(loading)

  const refs = useUsersRef(room)

  useEffect(() => {
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
      const map = users.reduce((map, user) => {
        map[user.id] = user
        return map
      }, {} as { [key:string] : User })

      setResult(succeeded(map))
    })

    return () => { refs.forEach(ref => ref.off()) }
  }, [refs])

  return result
}

function useRoomRef (roomId: string) {
  return useMemo(() => firebase.database().ref('rooms/' + roomId), [roomId])
}

function useUsersRef (room: Room | undefined) {
  const players = room?.players

  return  useMemo(() => {
    if (!players) return []

    return Object.keys(players).map(id =>
      firebase.database().ref('users/' + id)
    )
  }, [players])
}

function isJoined (user: User, room: Room) {
  return room.players && room.players[user.id]
}

function isOver (room: Room) {
  return room.players && Object.keys(room.players).length >= 8
}
