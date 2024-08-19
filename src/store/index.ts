import {configureStore} from "@reduxjs/toolkit";
import {moviesSlice} from "../slices/movies";

export const store = configureStore({
    reducer: {
        movies: moviesSlice.reducer
    }
})

export type AppStore = typeof store
export type AppDispatch = AppStore["dispatch"]
export type RootState = ReturnType<AppStore['getState']>