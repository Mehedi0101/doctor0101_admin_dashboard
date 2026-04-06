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
        changePassword: builder.mutation<{ success: boolean; message: string; data: any }, any>({
            query: (data) => ({
                url: "/users/change-password",
                method: "PATCH",
                body: data,
            }),
        }),
    }),
});

export const { useGetMeQuery, useUpdateProfileMutation, useChangePasswordMutation } = userApi;
