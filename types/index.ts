export type User = {
  id: string
  name: string
}

export type Room = {
  id: string;
  players?: { [key:string] : true };
}
