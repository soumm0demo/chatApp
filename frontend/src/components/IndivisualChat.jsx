import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ChatHeader from './ChatHeader';
import ChatLoading from './Loading/ChatLoading';
import {setUserDetails} from '../store/slices/soketSlice'

const IndivisualChat = ({ id, socket }) => {
    const [allChats, setAllChats] = useState([]);
    const [userDetails, setUserDetails] = useState({})
    const allUser = useSelector((state) => state.socket.allUser);

    const recipientId =  allUser ?  allUser[id] : null ;
    const userId = useSelector((state) => state.socket.userId);
    const onlineUser = useSelector ( (state) =>(state.socket.allUser))
    const [chatLoading, setChatLoading] = useState(true);
    const dispatch = useDispatch() ; 

    let isOnline ; 
    if(onlineUser)
        isOnline = Object.keys(onlineUser).includes(id);

    // scroll to lasst message
    const chatEndRef = useRef(null);

    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [allChats]); // Scrolls when messages change
  

    useEffect(() => {
        fetchAllChats();
        fetchUserDetails();
    }, [id]);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (data) => {
            console.log("Received message:", data.message);

            const obj = {
                receiverId: id,
                senderId: userId,
                text: data.message,
            };

            //  Use functional update to get the latest state
            setAllChats((prevChats) => [...prevChats, obj]);
        };

        const handleMessage = (data) => {
            console.log("Message event triggered:", data);
        };

        socket.on("message", handleMessage);
        socket.on("receive-message", handleReceiveMessage);

        return () => {
            socket.off("message", handleMessage);
            socket.off("receive-message", handleReceiveMessage);
        };
    }, [socket, id, userId]); //  Include id and userId

    const fetchAllChats = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/api/v1/message/${id}`, {
                withCredentials: true
            });

            console.log("Printed messages ::", res.data.data);
            setAllChats(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchUserDetails = async () => {
        setChatLoading(true);
        try {
            const res = await axios.get(`http://localhost:4000/api/v1/user/${id}`, {
                withCredentials: true
            });
          
            setUserDetails(res.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setChatLoading(false);
        }
    };

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            text: "",
        }
    });

    const onSubmit = async (data) => {
        try {
            const res = await axios.post(`http://localhost:4000/api/v1/sendmessage/${id}`, {
                text: data.text
            }, { withCredentials: true });

            if (res.data.success) {
                reset();
                console.log("Receiver socket ID:", recipientId);

                // Emit message via Socket.io
                socket.emit('send-message', {
                    recipientSocketId: recipientId,
                    message: data.text,
                    id: id
                });

                //  Update chat state immediately
                setAllChats((prev) => [...prev, res.data.data]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='w-[60vw]  relative h-screen'>
            <div className='h-[10vh]  '> <ChatHeader user={userDetails} isOnline = {isOnline} /> </div>
            {
                chatLoading ? ( <div className='h-[85vh] '> <ChatLoading />  </div> ):  (<div className='px-2 pb-4 mt-2  h-[84vh] text-[#ECDFCC] text-lg  overflow-auto '>
                    {allChats.map((chat, index) => (
                        <div key={chat._id || `temp-${index}`} className={`${chat.reciverId === id ? 'chat chat-end ' : 'chat chat-start'}`} > 
                            <div className={`${ !(chat.reciverId === id )? 'chat-bubble chat-bubble-neutral' :'chat-bubble chat-bubble-info'} `}> {chat.text} </div>
                        </div>
                    ))}
                    <div  ref={chatEndRef}/>
                </div> )


            }
           
            <div className=' h-[6vh]    flex flex-col gap-y-4 fixed w-full  '>
                <form className='text-white h-full flex outline-none' onSubmit={handleSubmit(onSubmit)}>
                    <input type="text" className='w-[50%] p-2 outline-none' {...register("text")} />
                    <button className='bg-slate-600 w-[10%] text-white'>Send</button>
                </form>
            </div>
        </div>
    );
};

export default IndivisualChat;
