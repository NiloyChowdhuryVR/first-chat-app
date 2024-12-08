'use client'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface FriendRequestsProps{
    incomingFriendRequests: IncomingFriendRequest[]
    sessionId: string
}

const FriendRequests = ({incomingFriendRequests,sessionId}:FriendRequestsProps) => {
    console.log(incomingFriendRequests)
    console.log('uwu')
    const router = useRouter()
    const [friendRequests,setFriendRequests] = useState<IncomingFriendRequest[]>(incomingFriendRequests)
    
    useEffect(() => {
      pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
      const friendRequestHandler = ({senderId,senderEmail}: IncomingFriendRequest)=>{
          setFriendRequests((prev)=>[...prev,{senderId,senderEmail}])
    }
    pusherClient.bind(`incoming_friend_requests`,friendRequestHandler)
    
    return ()=>{
        pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
        
        pusherClient.unbind(`incoming_friend_requests`,friendRequestHandler)
        }
    }, [sessionId])
    

    const acceptFriend = async(senderId:string)=>{
        try {
            await axios.post('/api/friends/accept',{id:senderId})
    
            setFriendRequests((prev)=>
                prev.filter((request)=> request.senderId !== senderId)
            )
            router.refresh()
            
        } catch (error) {
            console.error('Error ',error)
        }
    }
    const denyFriend = async(senderId:string)=>{
        await axios.post('/api/friends/deny',{id:senderId})

        setFriendRequests((prev)=>
            prev.filter((request)=> request.senderId !== senderId)
        )
        router.refresh()
    }

  return (
  <>
    
    {friendRequests.length === 0 ? (
        <p>Nothing to show here...</p>
    ):
    (friendRequests.map((request)=>{
        return(
        <div key={request.senderId}>
            <p>{request.senderEmail}</p>
            <button onClick={()=>acceptFriend(request.senderId)}>+</button>
            <button onClick={()=>denyFriend(request.senderId)}>x</button>
        </div>)
    }))

}
</>
)
}

export default FriendRequests