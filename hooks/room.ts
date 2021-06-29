import firebase from '../services/firebase';
import { useState, useEffect, useMemo } from 'react';
import { Result, loading, succeeded, failed } from '../utils/result'
import { Room } from '../types'

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

function useRoomRef (roomId: string) {
  return useMemo(() => firebase.database().ref('rooms/' + roomId), [roomId])
}
