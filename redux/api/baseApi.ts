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
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // If unauthorized, log the user out
        api.dispatch(logout());
    }
    return result;
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["User", "Blog", "Tour", "Transport", "Booking"],
    endpoints: () => ({}),
});
