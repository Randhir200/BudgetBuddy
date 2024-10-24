import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface InitialState {
    message: string | null;
    variant: "success" | "error" | "info" | "warning" | "default" | undefined;
}

const initialState: InitialState = {
    message: null,
    variant: undefined
}

const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        setAlert: (state, action: PayloadAction<InitialState>) => {
            state.message = action.payload.message;
            state.variant = action.payload.variant
        },
        clearAlert: (state) => {
            state.message = null;
            state.variant = undefined;
        }
    }
})

export const { setAlert, clearAlert} = alertSlice.actions;

export const alertReducer = alertSlice.reducer;