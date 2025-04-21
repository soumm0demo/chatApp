'use client'
import React, { use, useState } from 'react'
import { Input } from "../../components/ui/input"
import { useForm } from "react-hook-form";
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import axios from 'axios'
import { useRouter } from 'next/navigation';

const page = () => {

    const router = useRouter();
    const [file, setFile] = useState(null);

    const { register,
        handleSubmit,
        reset,
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
            username: "",

        }
    })
    const onSubmit = async (data) => {
        // console.log(data);
        const { username, email, password } = data;
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("file", file);;

        try {
            const res = await axios.post("http://localhost:4000/api/v1/signin", formData,{
                headers: { "Content-Type": "multipart/form-data" },
            } )
            console.log(res);
            if (res.data.success) {
                toast.success("User Created Successfully")
                reset()
                router.replace('/')
            }
        } catch (error) {
            const message = error.response.data.message;
            console.log(message);
            toast.error(message);
        }

    }

    return (
        <div className='w-screen h-screen flex justify-center items-center   bg-[#677D6A] mx-auto '>
            <div className='bg-[#40534C]  p-10 text-white'>
                <p className='text-4xl text-center'>Sign In </p>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='text-[#DDE6ED] text-2xl w-[30rem] flex flex-col gap-y-6 h-full'>

                    <label>
                        <p> UserName </p>
                        <Input type='text' placeholder='Enter your name ...' className='text-white' {...register("username")} />
                    </label>

                    <label>
                        <p> Email </p>
                        <Input type='email' placeholder='Enter your Email ...' className='text-white' {...register("email")} />
                    </label>
                    <label>
                        <p> PassWord </p>
                        <Input type='text' placeholder='Enter your password ...' className='text-white'{...register("password")} />
                    </label>

                    <label>
                        <p> Picture </p>
                        <input type='file' placeholder='Upload your picture ...' className='text-white'
                            onChange={(e) => { setFile(e.target.files[0]) }}
                        />
                    </label>


                    <Button type='submit' message="Sign in " />


                </form>


            </div>
        </div>
    )
}

export default page