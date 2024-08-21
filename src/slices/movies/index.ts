import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {Movie, MoviesState} from "../../types";
import config from "../../../config/app.json"

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})

const initialState = {
    movies: [],
    loading: false,
    error: null,
    filter: ""
} as MoviesState;

export const moviesSlice = createSliceWithThunk({
    name: "movies",
    initialState,
    selectors: {
        moviesSelector: (state) => state.movies,
        moviesState: (state) => state
    },
    reducers: (create) => ({
        setFilter: create.reducer((state, action: PayloadAction<string>) => {
           state.filter = action.payload;
        }),
        fetchMovies: create.asyncThunk<Movie[], string>(
            async  (searchText, thunkApi) => {
                try {
                    if (!searchText) {
                        return [];
                    }
                    const params = new URLSearchParams();
                    params.set("s", searchText);
                    const response = await fetch(config.omdbApiUrl + "&" + params.toString(), {
                    });
                    if (response.ok) {
                        return (await response.json())["Search"] as Movie[];
                    } else {
                        return thunkApi.rejectWithValue(Error(response.statusText));
                    }
                } catch (e) {
                    return thunkApi.rejectWithValue(e);
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = null;
                },
                fulfilled: (state, action: PayloadAction<Movie[]>) => {
                    state.movies = action.payload ? action.payload : [];
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

export const {fetchMovies, setFilter} = moviesSlice.actions;
export const {moviesSelector, moviesState} = moviesSlice.selectors;