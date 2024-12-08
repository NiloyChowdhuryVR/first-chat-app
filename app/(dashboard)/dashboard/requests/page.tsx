import FriendRequests from '@/components/FriendRequests'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import React from 'react'

const Requests = async () => {
    const session = await getServerSession(authOptions)
    if (!session) notFound()
    
    const incomingSenderIds = (await fetchRedis('smembers',`user:${session.user.id}:incoming_friend_requests`)) as string[]

    const incomingFriendRequests = await Promise.all(
        incomingSenderIds.map(async(senderId)=>{
            const sender = (await fetchRedis('get',`user:${senderId}`)) as string
            const senderParsed = JSON.parse(sender) as User
            return{
                senderId,
                senderEmail:senderParsed.email
            }
        })
    )

  return (
    <div>
        <FriendRequests incomingFriendRequests={incomingFriendRequests}
        sessionId={session.user.id}
        />
        
    </div>
  )
}

export default Requests