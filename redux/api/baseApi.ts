import { logout } from "@/store/slices/authSlice";
import { RootState } from "@/store";
import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        headers.set("Accept", "application/json");
        return headers;
    },
});

const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    // Guard: If the Redux store has a token but localStorage no longer has it,
    // the user has manually cleared their session. Clear the Redux state so
    // AuthGuard can redirect cleanly via React Router (no hard page reload).
    const storeToken = (api.getState() as RootState).auth.token;
    const localToken = typeof window !== "undefined" ? localStorage.getItem("thedoctor_token") : null;

    if (storeToken && !localToken) {
        api.dispatch(logout());
        // Return early — no need to make the request. AuthGuard will redirect.
        return { error: { status: 401, data: "Session expired" } as FetchBaseQueryError };
    }

    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Server rejected the token — clear Redux state.
        // EXCEPT: Don't logout for change-password 401s, as those are often "wrong old password" errors.
        const url = typeof args === "string" ? args : args.url;
        const isChangePassword = url.includes("change-password");

        if (!isChangePassword) {
            api.dispatch(logout());
        }
    }
    return result;
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["User", "Blog", "Tour", "Transport", "Booking", "HomeContent", "Notification", "SiteContent"],
    endpoints: () => ({}),
});
