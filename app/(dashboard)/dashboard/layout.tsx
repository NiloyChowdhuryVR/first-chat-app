import FriendRequestSidebarOptions from '@/components/FriendRequestSidebarOptions'
import SignOutButton from '@/components/SignOutButton'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { ReactNode } from 'react'
import { getFriendsByUserId } from '@/helpers/get-friends-by-user-id'
import SidebarChatList from '@/components/SidebarChatList'

const Layout = async ({children}:{children:ReactNode}) => {

    const session = await getServerSession(authOptions)
    if(!session) notFound()

        const friends = await getFriendsByUserId(session.user.id)

        const unseenRequestCount =( await fetchRedis('smembers',`user:${session.user.id}:incoming_friend_requests`) as User[]).length

  return (
    <div>
        <div>
        <Link href="/dashboard "><p>LOGO IPSUM 2</p></Link>
        </div>
        <div>
          {/* <Image src={session.user.image || testImg} height={300} width={300} alt='Pic'/> */}
            {session.user.image}
            <h1>{session.user.name}</h1>
            <p>{session.user.email}</p>
        </div>


        {friends.length>0?(
          <>
          <p>Your Chats</p>
          <SidebarChatList sessionId={session.user.id} friends={friends}/>
          </>
        ):null}


        <div><SignOutButton/></div>
        <div><FriendRequestSidebarOptions sessionId={session.user.id} initialUnseenRequestCount={unseenRequestCount}/></div>
    <div>{children}</div>
    </div>
  )
}

export default Layout