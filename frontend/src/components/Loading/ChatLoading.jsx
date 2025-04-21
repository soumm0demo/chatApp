import React from 'react'

const ChatLoading = () => {
    return (
        <div className='h-full '>
            <div className=" mx-[10rem] flex w-[50%] pt-[10rem] flex-col gap-4">
                <div className="skeleton h-32 w-full"></div>
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
            </div>
        </div>
    )
}

export default ChatLoading