import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser, AuthState } from "@/types/auth";

const TOKEN_KEY = "thedoctor_token";

const initialState: AuthState = {
    user: null,
    token: typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null,
    isInitialized: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: IUser; token: string }>
        ) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            if (typeof window !== "undefined") {
                localStorage.setItem(TOKEN_KEY, token);
            }
        },
        setUser: (state, action: PayloadAction<IUser | null>) => {
            state.user = action.payload;
        },
        setInitialized: (state) => {
            state.isInitialized = true;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isInitialized = true;
            if (typeof window !== "undefined") {
                localStorage.removeItem(TOKEN_KEY);
            }
        },
    },
});

export const { setCredentials, setUser, setInitialized, logout } = authSlice.actions;
export default authSlice.reducer;
