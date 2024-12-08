'use client'
import { pusherClient } from '@/lib/pusher'
import { ChatHrefConstructor, toPusherKey } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'


const SidebarChatList = ({friends,sessionId}:{friends:User[],sessionId:string}) => {
    const router= useRouter()
    const pathname = usePathname()
    const [unseenMessages,setUnseenMessages] = useState<Message[]>([]) 
    const [activeChats,setActiveChats] = useState<User[]>(friends) 


    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`))
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))
        const chatHandler = (message:Message)=>{
            
            const shouldNotify = pathname !== `/dashboard/chat/${ChatHrefConstructor(sessionId,message.senderId)}`

            if(!shouldNotify) return
            
            setUnseenMessages((prev)=> [...prev,message])


      }
        const newFriendHandler = (newFriend:User)=>{
            
            setActiveChats((prev)=>[...prev,newFriend])

      }
      pusherClient.bind(`new_message`,chatHandler)
      pusherClient.bind(`new_friend`,newFriendHandler)

      
      return ()=>{
          pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`))
          pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))
          
          pusherClient.unbind(`new_message`,chatHandler)
          pusherClient.unbind(`new_friend`,newFriendHandler)
          }
      }, [pathname,router,sessionId]) 


    useEffect(()=>{
        if(pathname?.includes('chat')){
            setUnseenMessages((prev)=>{
                return prev.filter((msg)=>!pathname.includes(msg.senderId))
            })
        }
    },[pathname])

  return (
    <ul>
        {activeChats.sort().map((friend)=>{
            const unseenMessagesCount = unseenMessages.filter((unseenMsg)=>{
                return unseenMsg.senderId === friend.id
            }).length

            return <li key={friend.id}>
                <a href={`/dashboard/chat/${ChatHrefConstructor(sessionId,friend.id)}`}>{friend.name}
                {unseenMessagesCount>0?
                <div>{unseenMessagesCount}</div>
                :null}</a>
            </li>
        })}

        
    </ul>
  )
}

export default SidebarChatList