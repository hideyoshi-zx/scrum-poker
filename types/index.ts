export type User = {
  id: string
  name: string
}

export type Room = {
  id: string;
  users: { [key:string] : true };
}
