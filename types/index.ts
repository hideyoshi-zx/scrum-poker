export type PageProps = {
  uid: string;
}

export type Room = {
  id: string
  open: boolean
  players?: {
    [key:string]: Player
  }
}

export type Player = {
  uid: string
  name: string
  card: Card
}

export const CARDS = [
  '0',
  '1',
  '2',
  '3',
  '5',
  '8',
  '13',
  '21',
  '34',
  '55',
  '89',
  '?',
  '山口',
] as const
export type Card = typeof CARDS[number]  ;
