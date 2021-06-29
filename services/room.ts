import firebase from '../services/firebase';
import { nanoid } from 'nanoid'
import { Room, Card } from '../types'

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

export function addPlayer (room: Room, uid: string, name: string) {
  const ref = firebase.database().ref(`rooms/${room.id}/players/${uid}`)

  return new Promise((resolve, reject) => {
    firebase.database().ref('.info/connected').on('value', (snapshot) => {
      if (snapshot.val() == false) {
        return
      }

      ref.onDisconnect().set(null).then(() => {
        ref.set({
          uid,
          name,
          card: '',
        }, (error) => {
          error ? reject(error) : resolve(true)
        })
      })
    });
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

export function isJoined (room: Room, uid: string) {
  const players = room.players || {}
  return !!players[uid]
}
