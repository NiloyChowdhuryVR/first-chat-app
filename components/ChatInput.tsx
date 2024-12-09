'use client'
import React, { useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from './ui/button';
import axios from 'axios';

const ChatInput = ({chatPartner,chatId}:{chatPartner:User,chatId:string}) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const [input,setInput] = useState<string>('')
    // const [isLoading,setIsLoading] = useState<boolean>(false)
    const sendMessage = async ()=>{
        if(!input) return
        // setIsLoading(true)
        try {
            // await new Promise((resolve) => setTimeout(resolve, 1000))
            setInput('')
            await axios.post('/api/message/send',{text:input,chatId})
            textareaRef.current?.focus()
        } catch (error) {
            return new Response(`an Error Occured : ${error} `)

        }
        finally{
            // setIsLoading(false)
        }
    }
  return (
    <div>

    <div>
        <TextareaAutosize ref={textareaRef} onKeyDown={(e) =>{
            if(e.key === 'Enter' && !e.shiftKey){
                e.preventDefault()
                sendMessage()
            }
            
        }} minRows={2} value={input}
        onChange={(e)=>{setInput(e.target.value)}}
        placeholder={`Message ${chatPartner.name}`}/>
    </div>
    <div onClick={()=> textareaRef.current?.focus()}>

    </div>
    <div>
        <div>
            <Button onClick={sendMessage} type='submit'>Send</Button>
        </div>
    </div>
        </div>
  )
}

export default ChatInput