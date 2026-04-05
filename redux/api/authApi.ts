import { ILoginInput, ILoginResponse } from "@/types/auth";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<ILoginResponse, ILoginInput>({
            query: (data) => ({
                url: "/auth/login-admin",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const { useLoginMutation } = authApi;
