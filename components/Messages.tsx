'use client'
import { cn, toPusherKey } from '@/lib/utils'
import { Message } from '@/lib/validations/message'
import React, { useEffect, useRef, useState } from 'react'
import {format} from 'date-fns'
import { pusherClient } from '@/lib/pusher'

const Messages = ({initialMessages,sessionId,chatId}:{initialMessages:Message[],sessionId:string,chatId:string}) => {

    const [messages,setMessages] = useState<Message[]>(initialMessages)
    const scrollDownRef = useRef<HTMLDivElement | null>(null)
    const formatTimestamp = (timestamp:number)=>{
        return format(timestamp,'HH:mm')
    }

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`chat:${chatId}`))
        const messageHandler = (message:Message)=>{
             setMessages((prev)=>[message,...prev])
      }
      pusherClient.bind(`incoming-message`,messageHandler)
      
      return ()=>{
          pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`))
          
          pusherClient.unbind(`incoming-message`,messageHandler)
          }
      }, [chatId])


  return (
    <div id='messages' className='flex h-full flex-1 flex-col-reverse'>
        <div ref={scrollDownRef}></div>

        {messages.map((message,/*index*/)=>{
            const isCurrentUser = message.senderId === sessionId
            
            return(
                <div key={`${message.id}-${message.timestamp}`}>
                    {/* Use this concept to justify items left and right according to sender  */}
                    <div className={cn('flex items-end',{
                        'justify-end': isCurrentUser,
                    })}>
                        <span>{message.text}{' '}</span>
                        <span>{formatTimestamp(message.timestamp)}</span>
                    </div>
                </div>
            )
        })}
    </div>
  )
}

export default Messages