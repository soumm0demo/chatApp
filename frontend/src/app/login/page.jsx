"use client"
import React, { useState } from 'react'
import { Input } from "../../components/ui/input"
import { set, useForm } from "react-hook-form";
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useDispatch } from 'react-redux'
import Cookies from 'js-cookie';
import { setToken } from '../../store/slices/tokenSlice';
import {setUserId, setUserName , setUserDetails } from '../../store/slices/soketSlice';
import PageSwitchLoading from '../../components/Loading/PageSwitchLoading';

const page = () => {

    const dispatch = useDispatch() ; 
    const router = useRouter() ; 
    const [loadingSignin , setLoadingSignin] = useState(false) ; 

    const { register,
        handleSubmit,
        reset,
    } = useForm({
        defaultValues: {
            email: "",
            Password: "",
        }
    })
    const onSubmit = async (data) => {
        try {
             
            const res = await axios.post( process.env.NEXT_PUBLIC_BASE_URL+ "api/v1/login", {
                email: data.email,
                password: data.Password
            },{ withCredentials: true })
            if(res.data.success){
                // console.log(res);
                const token = Cookies.get("token") ; 
                // console.log(token);
                console.log(res.data.user);
                dispatch(setUserDetails({user : res.data.user}))
                dispatch(setUserId({userId: res.data.user._id}))
                dispatch(setUserName({userName : res.data.user.username || "no Name found"}))
                dispatch(setToken({token : token })) ; 
                toast.success("User Logged in Successfully")

                reset() 
                router.replace('/')
            }

        } catch (error) {
            console.log(error);
            // toast.error(error.response.data.message)
        }
    }
    const clickHandler = ()=>{
        setLoadingSignin(true) ; 
        try{
            router.replace("/signin")
    
        }catch(err){
            console.log(
                err
            );
        }finally{
            setLoadingSignin(false) ; 
        }
    }

    return (
        <div className='w-screen h-screen flex justify-center items-center   bg-[#677D6A] mx-auto '>
           {
             !loadingSignin ? 
            ( <div className='bg-[#40534C] h-[40vh] p-10'>
                <p className='text-4xl text-center'>Log In </p>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='text-[#DDE6ED] text-2xl w-[30rem] flex flex-col gap-y-6'>
                        <label>
                            <p> Email </p>
                            <Input type='email' placeholder='Enter your Email ...' className='text-white' {...register("email")} />
                        </label>
                        <label>
                            <p> PassWord </p>
                            <Input type='text' placeholder='Enter your password ...' className='text-white'{...register("Password")} />
                        </label>
                        <Button type='submit' message="Log in " />
                    </form>
    
                    <div>
                        <p>Don't have a account ? .. </p>
                        <Button type="button" message="Sign in" onClick={clickHandler}/>
                    </div>
    
                </div>) : 
                (
                    <PageSwitchLoading />
                )
           }
        </div>
    )
}

export default page