import axios from 'axios';
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../store/slices/soketSlice'
import { RiLogoutCircleFill } from "react-icons/ri";
import { useRouter } from 'next/navigation';
import {setToken} from '../store/slices/tokenSlice'
// import {setUserDetails} from '../store/slices/soketSlice'


const DrawerContent = () => {
    const user = useSelector((state) => (state.socket.user))
    const [isEditable, setEditable] = useState(false);
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();
    // console.log( " In drawer :: " , user);
    const router = useRouter() ; 

    const { register, handleSubmit } = useForm({
        defaultValues: {
            username: user?.username,
            email: user?.email,
            password: "",
        }
    })

    const handleLogout = async ()=>{
        try {
            const base_url = process.env.NEXT_PUBLIC_BASE_URL ; 
            const url = base_url + "api/v1/logout"
            const res = await axios.get(url ,  {withCredentials:true})
            toast.success(res.data.message) ;  
            router.replace("/login") ; 
            dispatch(setToken({token : "" })) ;
            dispatch(setUserDetails({user : {}})) ; 

        } catch (error) {
            toast.error(error.message) ; 
        }
    }

    const handleCancel = () => {
        setEditable((prev) => (!prev));
    }

    const submitHandler = async (data) => {
        try {
            const base_url = process.env.NEXT_PUBLIC_BASE_URL;

            // console.log(data);
            const { username, email } = data;
            const formData = new FormData();
            formData.append("username", username)
            formData.append("email", email)
            if (file)
                formData.append("file", file);
            const url = base_url + "api/v1/updateuser";
            const res = await axios.post(url, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            })

            console.log(res.data.user);
            dispatch(setUserDetails({ user: res.data.user }))
            // console.log(res.data);

        } catch (error) {
            toast.error(error.message);
        } finally {
            setEditable((prev) => (!prev))
        }
    }
    const fileInputRef = useRef(null);

    const handleIconClick = () => {
        fileInputRef.current.click(); // Programmatically open file input
    };


    return (
        <div className='relative  bg-[#3F4E4F] text-base-content h-full w-[30vw] p-4 flex flex-col justify-center items-center '>

            <div className=' flex flex-col gap-y-24 w-full h-[80%] relative'>
                <div className="avatar justify-center items-center flex  ">
                    <div className="w-40 h-40 rounded-full  justify-center items-center flex ">
                        <img src={user?.imgUrl} />
                    </div>
                    <div className="flex flex-col items-center gap-3 absolute bottom-[-1rem] right-[30%]">
                        {/* Hidden File Input */}
                        <input
                            type="file"
                            ref={(ref) => (fileInputRef.current = ref)} // Ensure ref is assigned properly
                            className="hidden"
                            onChange={(e) => (setFile(e.target.files[0]))} // Handle file selection
                        />

                        {/* Custom Upload Icon */}
                        {
                            isEditable && <div
                                className="cursor-pointer  "
                                onClick={handleIconClick}
                            >
                                <div className='w-10 border hover:scale-105 transition-all transform duration-150'>
                                    <img src='./camera.svg' className='w-6' />
                                </div>
                            </div>
                        }
                    </div>
                </div>

                <form className='flex flex-col  justify-center gap-y-6'
                    onSubmit={handleSubmit(submitHandler)}
                >
                    <div className='  flex flex-col gap-y-4 px-4'>
                        <label className='flex text-4xl font-bold  justify-start gap-x-6 items-center  '>
                            <img src='./drawerUserSvg.svg' className='relative w-10  ' />
                            <input type='text' {...register("username")} className={`max-w-[50%] p-1  text-white  ${isEditable ? 'cursor-default bg-gray-600' : 'cursor-not-allowed bg-transparent'} `}
                                disabled={!isEditable}
                            />
                        </label>
                        <label className='flex gap-x-2 text-xl '>
                            <img src='./drawerEmailSvg.svg' className={`w-14  `} />
                            <input type='text' {...register("email")} className={`w-fit bg-transparent text-white ${isEditable ? 'cursor-default bg-gray-600 ' : 'cursor-not-allowed bg-transparent'} `}
                                disabled={!isEditable}
                            />
                        </label>
                    </div>
                    {/* <label>
                        <p> change Password :: </p>
                        <input type='text' {...register("password")} className='bg-transparent text-white' />
                    </label> */}
                    <div className='flex gap-x-10 w-full justify-evenly'>
                        <button type='button' className={`w-[50%] p-2 hover:scale-90 transform duration-150 rounded-3xl border ${!isEditable ? 'cursor-default' : 'cursor-not-allowed'} `} disabled={isEditable}
                            onClick={() => {
                                setEditable((prev) => (!prev))
                            }}
                        > Edit </button>
                        <button type='submit' className={`w-[50%] p-2 hover:scale-90 transform duration-150  rounded-3xl border  ${isEditable ? 'cursor-default' : 'cursor-not-allowed'} `} disabled={!isEditable}

                        > Save </button>
                    </div>
                    {
                        isEditable && <button className='border p-2 rounded-2xl' onClick={handleCancel}> cancel  </button>

                    }

                </form>


            </div>


            <button className='absolute bottom-2 right-4 hover:scale-90 transform duration-200'
                onClick={handleLogout}
            >
                <RiLogoutCircleFill className='h-20 w-20' />

            </button>
        </div>
    )
}

export default DrawerContent