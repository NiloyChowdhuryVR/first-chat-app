'use client'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { addFriendValidator } from '@/lib/validations/add-friend'
import axios, { AxiosError } from 'axios'
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const AddFriendButton = () => {

  const [showSuccessState,setShowSuccessState] = useState<boolean>(false)

  type FormData = z.infer<typeof addFriendValidator>

  const {
   register,setError,handleSubmit,formState:{errors}
  } = useForm<FormData>({
    resolver : zodResolver(addFriendValidator)
  })


  const addFriend = async (email : string) => {
    try {
      const validatedEmail = addFriendValidator.parse({email})
 
      await axios.post('/api/friends/add',{
        email : validatedEmail,
      })

      setShowSuccessState(true)

    } catch (error) {
      if(error instanceof z.ZodError){
        setError('email',{message:error.message});
        return
      }
      if(error instanceof AxiosError){
        setError('email',{message:error.response?.data})
        return
      }

      setError('email',{message:'Something Went Wrong!'})
    }
  }

  const onSubmit = (data : FormData) => {
    addFriend(data.email)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">Add Friend By Email</label>

        <div>
            <input {...register('email')} type="text" placeholder='you@email.com' />
            <Button>Add</Button>
        </div>
        <p>{errors.email?.message}</p>
        {showSuccessState?"SENT MATHAFAAK":null}
    </form>
  )
}

export default AddFriendButton