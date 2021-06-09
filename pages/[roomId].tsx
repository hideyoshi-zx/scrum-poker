import React from 'react';
import { useRouter } from 'next/router'

type Props = {
  userId: string;
}

export default function Home(_props: Props) {
  const router = useRouter()
  const { roomId } = router.query

  return <div>roomId: {roomId}</div>;
}
