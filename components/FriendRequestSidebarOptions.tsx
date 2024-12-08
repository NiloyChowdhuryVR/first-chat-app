'use client'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import React, { useEffect, useState } from 'react'


interface FriendRequestSidebarOptions{
    sessionId: string
    initialUnseenRequestCount: number
}

const FriendRequestSidebarOptions = ({sessionId,initialUnseenRequestCount}:FriendRequestSidebarOptions) => {

    const [unseenRequestCount, setUnseenRequestCount] = useState(initialUnseenRequestCount)

    useEffect(() => {
      pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
      pusherClient.subscribe(toPusherKey(`user:${sessionId}:ifriends`))
      const friendRequestHandler = ()=>{
        setUnseenRequestCount((prev)=>prev+1)
      }
      const addedFriendHandler = ()=>{
        setUnseenRequestCount((prev)=>prev-1)
      }
      pusherClient.bind(`incoming_friend_requests`,friendRequestHandler)
      pusherClient.bind(`new_friend`,addedFriendHandler)
      
      return ()=>{
        pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
        pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:ifriends`))
        
        pusherClient.unbind(`incoming_friend_requests`,friendRequestHandler)
        pusherClient.unbind(`new_friend`,addedFriendHandler)
      }
    }, [sessionId])
    
    
    return (
      <>
        <p>Friend Request</p>
        {unseenRequestCount > 0 ? (
            <div>{unseenRequestCount}</div>
            ) : null}
    
            </>
  )
}

export default FriendRequestSidebarOptions