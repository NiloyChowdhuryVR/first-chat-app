'use client'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { signOut } from 'next-auth/react'

const SignOutButton = () => {

    const [isSigningOut,setIsSigningOut] = useState<boolean>(false)

  return (
    <Button variant="ghost" onClick={async ()=>{
        try {
            setIsSigningOut(true)
            await signOut()
        } catch (error) {
            console.log(error)
        }
        finally{
            setIsSigningOut(false)
        }
    }}>
        {isSigningOut?"Signing Out...":"Sign Out"}</Button>  )
} 

export default SignOutButton