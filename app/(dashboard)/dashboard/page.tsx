import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation';
import React from 'react'

const Dashboard = async () => {
const session = await getServerSession(authOptions);
if(!session) notFound()
const user = session?.user.name

  return (
    <div>{user}</div>
  )
}

export default Dashboard