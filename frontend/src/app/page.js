"use client";
import { useSelector } from "react-redux";
import { use, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import SingleUser from "../components/ui/SingleUser";
import IndivisualChat from "../components/IndivisualChat";
import io from "socket.io-client";
import { useDispatch } from "react-redux";
import { setSocket, setUser } from "../store/slices/soketSlice";
import LogoHeader from "../components/LogoHeader";
import UserLogo from '../components/UserLogo'
import ChatPreview  from "../components/ChatPreview";


export default function Home() {
  const token = useSelector((state) => state.token.token); // Check if `token` exists
  const router = useRouter(); // Get the router object
  const dispatch = useDispatch();
  const socketSlice = useSelector((state) => state.socket);
  const allOnlineUser = useSelector((state) => (state.socket.allUser));

  const [alllUser, setAllUser] = useState([]);
  const [id, setId] = useState(null);

  const searchParams = useSearchParams();
  const socket = useMemo(() => io("http://localhost:4000", {
    transports: ["websocket", "polling"],
    withCredentials: true,
    autoConnect: false,  // Prevent auto-connection
  }), []);


  useEffect(() => {
    console.log("token", token);
    if (!token) {
      toast.error("Please Login First")
      router.replace('/login')
    }
    getAllUser();
  }, [token])

  useEffect(() => {
    const urlId = searchParams.get("id");

    setId(urlId);
  }, [searchParams])
  useEffect(() => {
    socket.connect();
  
    const handleConnect = () => {
      console.log("Connected to WebSocket:", socket.id);
      dispatch(setSocket({ socketId: socket.id }));
      dispatch(setUser({ userId: socketSlice.userId, socketId: socket.id }));
  
      // Register user after connection is established
      socket.emit("register-user", { userId: socketSlice.userId });
    };
  
    const handleUpdateUser = (users) => {
      dispatch(setUser({ allUser: users })); // ✅ Ensure correct structure
    };
  
    const handleDisconnect = () => {
      console.log("Disconnected from WebSocket");
    };
  
    const handleMessage = (data) => {
      console.log(data);
    };
  
    // Set up event listeners
    socket.on("connect", handleConnect);
    socket.on("update-user", handleUpdateUser);
    socket.on("disconnect", handleDisconnect);
    socket.on("message", handleMessage);
  
    return () => {
      //Clean up event listeners to prevent memory leaks
      socket.off("connect", handleConnect);
      socket.off("update-user", handleUpdateUser);
      socket.off("disconnect", handleDisconnect);
      socket.off("message", handleMessage);
      socket.disconnect();
    };
  }, []);
  



  const getAllUser = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/allusers", {
        withCredentials: true,
      })
      setAllUser(res.data.data);
      // console.log(alllUser);
    } catch (error) {
      console.log(error);
    }
  }






  return (
    <div className="w-screen h-screen bg-[#40534C] text-white flex flex-row ">
      <div className="w-[40vw] flex flex-col">
        <div className="flex  justify-between p-2 items-center bg-[#344C64]">
          <div> <LogoHeader /> </div>
          <div> <UserLogo /> </div>
        </div>
        <div className="flex flex-col gap-y-4 px-2  mt-4 w-[40vw] ">
          {
            alllUser.map((user) => {
              let isOnline  ; 
              console.log( " onlinen array " , allOnlineUser);
              if(allOnlineUser)
                isOnline = Object.keys(allOnlineUser).includes(user._id);
              return (<SingleUser key={user._id} user={user} id={user._id} isOnline={isOnline} />)
            })
          }
        </div>

      </div>

      <div className="w-[60vw] bg-[#1A3636]">

        {
          id ? <IndivisualChat id={id} socket={socket} /> : <ChatPreview  />
        }

      </div>
    </div>
  );
}
