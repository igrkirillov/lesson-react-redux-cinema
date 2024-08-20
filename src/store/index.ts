import {configureStore} from "@reduxjs/toolkit";
import {moviesSlice} from "../slices/movies";
import {detailsSlice} from "../slices/details";
import {favoritesSlice} from "../slices/favorites";

export const store = configureStore({
    reducer: {
        movies: moviesSlice.reducer,
        details: detailsSlice.reducer,
        favorites: favoritesSlice.reducer
    }
})

export type AppStore = typeof store
export type AppDispatch = AppStore["dispatch"]
export type RootState = ReturnType<AppStore['getState']>