import { IUser } from "@/types/auth";
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<{ success: boolean; data: IUser }, void>({
            query: () => "/users/me",
            providesTags: ["User"],
        }),
        updateProfile: builder.mutation<{ success: boolean; message: string; data: IUser }, FormData>({
            query: (data) => ({
                url: "/users/update-profile",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const { useGetMeQuery, useUpdateProfileMutation } = userApi;
