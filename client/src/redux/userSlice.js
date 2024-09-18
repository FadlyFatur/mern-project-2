import { createSlice } from "@reduxjs/toolkit";

const initialSlice = {
    currentUser: null,
    loading: false,
    error: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState : initialSlice,
    reducers:{
        signInStart: (state) => {
            state.loading = true
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
        },
        signInFailure: (state, action) => {
            state.currentUser = null;
            state.loading = false; 
            state.error = action.payload;
        },
        updateUserStart: (state) => {
            state.loading = true;
        },
        updateUserSuccess: (state, action) =>{
            state.loading = false;
            state.error = false;
            state.currentUser = action.payload;
        },
        updateUserFailure: (state, action) =>{
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.loading = true;
        },
        deleteUserSuccess: (state) =>{
            state.loading = false;
            state.error = false;
            state.currentUser = null;
        },
        deleteUserFailure: (state, action) =>{
            state.loading = false;
            state.error = action.payload;
        },
        Signout: (state) =>{
            state.loading = false;
            state.error = false;
            state.currentUser = null;
        },
        
    }
});

export const { 
    signInStart, signInSuccess, signInFailure, updateUserStart,  updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, Signout
} = userSlice.actions; 

export default userSlice.reducer;