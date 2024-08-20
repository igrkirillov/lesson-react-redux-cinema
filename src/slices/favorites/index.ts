import {createSlice, current, PayloadAction} from "@reduxjs/toolkit";
import {FavoriteNote, FavoriteNotesState, Movie} from "../../types";
import {getFromLocalStorage, saveToLocalStorage} from "../../utils";

const initialState = {
    favorites: getFromLocalStorage()
} as FavoriteNotesState;

export const favoritesSlice = createSlice({
    name: "favorites",
    initialState,
    selectors: {
        favoritesState: (state) => state
    },
    reducers: (create) => ({
        addFavorite: create.reducer((state, action: PayloadAction<Movie>) => {
            const favorite = state.favorites.find(f => f.movie.imdbID === action.payload.imdbID);
            // если такой уже есть в любимых
            if (favorite) {
                favorite.createdAt = Date.now();
            } else {
                state.favorites.push({movie: action.payload, createdAt: Date.now()} as FavoriteNote);
            }
            saveToLocalStorage(current(state.favorites));
        }),
        removeFavorite: create.reducer((state, action: PayloadAction<FavoriteNote>) => {
            const index = state.favorites.findIndex(f => f.movie.imdbID === action.payload.movie.imdbID);
            if (index >= 0) {
                state.favorites.splice(index, 1);
            }
            saveToLocalStorage(current(state.favorites));
        })
    })
})

export const {addFavorite, removeFavorite} = favoritesSlice.actions;
export const { favoritesState} = favoritesSlice.selectors;