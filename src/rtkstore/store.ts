import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import ticketReducer from "./ticketReducer";

export const store = configureStore({
  reducer: {
    ticketReducer: ticketReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch // Export a hook that can be reused to resolve types
