import React from 'react'


const ChatHeader = ({ user, isOnline }) => {

    const username = user.username;
    const imgUrl = user.imgUrl
    return (
        <div className='flex h-full gap-x-8  bg-[#677D6A] justify-start items-center'>
            <div className='pl-10'>
                <img src={imgUrl} className='w-20 h-20 rounded-full' />
            </div>
            <div>
                <p className='text-xl font-bold uppercase'>{username}</p>
                <p>
                    {
                        isOnline ? 'Online' : 'Offline' 
                    }
                </p>
            </div>
        </div>
    )
}

export default ChatHeader