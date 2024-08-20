import {configureStore} from "@reduxjs/toolkit";
import {moviesSlice} from "../slices/movies";
import {detailsSlice} from "../slices/details";

export const store = configureStore({
    reducer: {
        movies: moviesSlice.reducer,
        details: detailsSlice.reducer
    }
})

export type AppStore = typeof store
export type AppDispatch = AppStore["dispatch"]
export type RootState = ReturnType<AppStore['getState']>