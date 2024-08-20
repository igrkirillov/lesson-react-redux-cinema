import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {DetailInfo, DetailsState} from "../../types";
import config from "../../../config/app.json"

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})

const initialState = {
    details: {},
    loading: false,
    error: null
} as DetailsState;

export const detailsSlice = createSliceWithThunk({
    name: "details",
    initialState,
    selectors: {
        details: (state) => state.details,
        detailsState: (state) => state
    },
    reducers: (create) => ({
        fetchDetails: create.asyncThunk<DetailInfo, string>(
            async  (id, thunkApi) => {
                try {
                    if (!id) {
                        return {} as DetailInfo;
                    }
                    const response = await fetch(config.omdbApiUrl + "&i=" + id + "&plot=full");
                    if (response.ok) {
                        return (await response.json()) as DetailInfo;
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
                fulfilled: (state, action: PayloadAction<DetailInfo>) => {
                    state.details = action.payload ? action.payload : {} as DetailInfo;
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

export const {fetchDetails} = detailsSlice.actions;
export const {details, detailsState} = detailsSlice.selectors;