import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {Movie, MoviesState} from "../../types";
import {delay} from "../../utils";

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})

const initialState = {
    movies: [],
    loading: false,
    error: null
} as MoviesState;

export const moviesSlice = createSliceWithThunk({
    name: "movies",
    initialState,
    selectors: {
        moviesSelector: (state) => state.movies,
        loadingSelector: (state) => state.loading
    },
    reducers: (create) => ({
        fetchMovies: create.asyncThunk<Movie[]>(
            async  (_, thunkApi) => {
                await delay(3);
                return [] as Movie[];
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = null;
                },
                fulfilled: (state, action: PayloadAction<Movie[]>) => {
                    state.movies.push(...action.payload);
                },
                rejected: (state, action) => {
                    state.error = action.payload as Error;
                },
                settled: (state) => {
                    state.loading = false;
                }
            })
    })
})

export const {fetchMovies} = moviesSlice.actions;
export const {moviesSelector, loadingSelector} = moviesSlice.selectors;