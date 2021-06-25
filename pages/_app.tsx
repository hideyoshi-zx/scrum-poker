import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useUserId, useCurrentUser, createUser } from '../usecases/auth'
import React, { useState } from 'react'

export default function MyApp(props : AppProps) {
  const userId = useUserId()
  if (!userId) return <div>Loading...</div>

  return <LoggedIn {...props} userId={userId} />
}

function LoggedIn ({ Component, pageProps, userId } : AppProps & { userId : string }) {
  const currentUserResult = useCurrentUser(userId)
  if (currentUserResult.error === 'NotFound') return <UserForm userId={userId} />
  if (!currentUserResult.data) return <div>Loading</div>

  return (
    <div>
      <Component {...pageProps} currentUser={currentUserResult.data} />
    </div>
  )
}

function UserForm ({ userId } : { userId : string }) {
  const [name, setName] = useState('')

  const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {
    createUser(userId, name)
    event.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={handleChange} placeholder="Input your name" />
    </form>
  )
}
