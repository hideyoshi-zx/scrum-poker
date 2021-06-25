export type User = {
  id: string
  name: string
}

export type Room = {
  id: string
  open: boolean
  players?: {
    [key:string]: Player
  }
}

export type Player = {
  id: string
  card: Card
}

export const CARDS = [
  '',
  '0',
  '1',
  '2',
  '3',
  '5',
  '8',
  '?',
] as const
export type Card = typeof CARDS[number]  ;
