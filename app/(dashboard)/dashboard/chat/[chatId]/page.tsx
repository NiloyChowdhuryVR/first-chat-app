import ChatInput from '@/components/ChatInput'
import Messages from '@/components/Messages'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { messageArrayValidator } from '@/lib/validations/message'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React from 'react'

const getChatMessages = async(chatId:string) =>{
    try {
        const results:string[] = await fetchRedis(`zrange`,`chat:${chatId}:messages`,0,-1)

        const dbMessages = results.map((message) => JSON.parse(message) as Message)

        const reversedDbMessages = dbMessages.reverse()

        const messages = messageArrayValidator.parse(reversedDbMessages)
        return messages
    } catch (error) {
        throw new Error(`error occured : ${error}`)
        notFound()
        
    }

}



const page = async ({params}:{params:{chatId:string}}) => {

    const {chatId} = params
    const session = await getServerSession(authOptions)
    if(!session) notFound()
    const {user} = session

    const [userId1,userId2] = chatId.split("--")

    if(user.id !== userId1 && user.id !== userId2){
        notFound()
    }

    const chatPartnerId  = user.id === userId1 ? userId2 : userId1;
    // const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User

    const chatPartnerRaw = await fetchRedis('get',`user:${chatPartnerId}`) as string
    const chatPartner = JSON.parse(chatPartnerRaw) as User

    const initialMessages = await getChatMessages(chatId)

  return (
    <div>
        <div>
            <Image src={chatPartner.image} alt={`${chatPartner.name} profile pic`} height={50} width={50} className=' rounded-full'/>
            
        </div>
        <div>
            <span>{chatPartner.name}</span>
            <br></br>
            <span>{chatPartner.email}</span>
        </div>
        <div>
            <Messages initialMessages={initialMessages} sessionId={session.user.id} chatId={chatId}/>
            <ChatInput chatPartner={chatPartner} chatId={chatId}/>
        </div>
    </div>
  )
}

export default page