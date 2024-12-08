'use client'
import { Button } from '@/components/ui/button'
import React from 'react'
import { signIn } from 'next-auth/react'

const Login = () => {
  // const [isLoading,setIsLoading] = useState(false);

    const loginWithGoogle = async () => {
      // setIsLoading(true)
      
      try {
         await signIn('google')
      } catch (error) {
        console.log(error);
      }
      finally{
        // setIsLoading(true)
      }
    }

  return (
    <>
    <div>Login</div>
    <Button type='button' onClick={loginWithGoogle}>Hi</Button>
    </>
  )
}

export default Login