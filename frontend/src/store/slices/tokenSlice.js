"use client";
import { createSlice } from "@reduxjs/toolkit";

const getTokenFromStorage = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || null;
  }
  return null;
};

const tokenSlice = createSlice({
  name: "tokenSlice",
  initialState: {
    token:"",
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.token ;
    },
  },
});

export const { setToken } = tokenSlice.actions;
export default tokenSlice.reducer;
