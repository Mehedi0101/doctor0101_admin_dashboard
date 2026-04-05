import { baseApi } from "./baseApi";
import { IHomeContentResponse } from "@/types/homeContent";

export const homeContentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getHomeContent: builder.query<IHomeContentResponse, void>({
            query: () => "/home-content",
            providesTags: ["HomeContent"],
        }),
        updateContactNow: builder.mutation<{ success: boolean; message: string; data: any }, FormData>({
            query: (data) => ({
                url: "/home-content/contact-now",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["HomeContent"],
        }),
    }),
});

export const { useGetHomeContentQuery, useUpdateContactNowMutation } = homeContentApi;
