"use client"
import { createSlice } from "@reduxjs/toolkit";
// import { all } from "axios";

const socketSlice = createSlice({
    name: "socketSlice",
    initialState: {
        socket: null,
        userId: null,
        allUser: {},
        userName: "",
        user : null , 
    },
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload.socketId;
            console.log("socket id from slice : ", state.socket);
        },
        setUser: (state, action) => {

            console.log( "frntend" , action.payload.allUser);
            state.allUser = action.payload.allUser ; 
            
        },
        setUserId: (state, action) => {
            console.log("user id from slice : ", action.payload.userId);
            state.userId = action.payload.userId;
        },
        setUserName: (state, action) => {
            state.userName = action.payload.userName;
        } , 
        setUserDetails :(state , action )=>{
            // console.log("from slice :: ",  action.payload.user);
            state.user = action.payload.user ; 
        }
    }

});

export const { setSocket, setUser, setUserId, setUserName , setUserDetails } = socketSlice.actions;
export default socketSlice.reducer;
