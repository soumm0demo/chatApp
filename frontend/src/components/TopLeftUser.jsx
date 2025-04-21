import React from 'react'
import { useSelector } from 'react-redux'

const TopLeftUser = () => {
    const user = useSelector((state) => state.socket.user)
    // console.log(user);
    return (
        <div className='mr-4 flex flex-col justify-center items-center '>
            <div className="avatar">
                <div className="w-10 border  rounded-full">
                    <img src={user?.imgUrl} />
                </div>
            </div>
            <div className='text-xl font-bold'>

                {user?.username}

            </div>
        </div>
    )
}

export default TopLeftUser