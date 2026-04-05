import { baseApi } from "./baseApi";
import { ITransportResponse, ITransportsResponse } from "@/types/transport";

export const transportApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllTransports: builder.query<ITransportsResponse, string | void>({
            query: (params) => ({
                url: "/transports",
                params: params ? JSON.parse(params) : undefined,
            }),
            providesTags: ["Transport"],
        }),
        getSingleTransport: builder.query<ITransportResponse, string>({
            query: (id) => `/transports/${id}`,
            providesTags: (result, error, id) => [{ type: "Transport", id }],
        }),
        addTransport: builder.mutation<ITransportResponse, FormData>({
            query: (data) => ({
                url: "/transports",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Transport"],
        }),
        updateTransport: builder.mutation<ITransportResponse, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/transports/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ["Transport", { type: "Transport", id }],
        }),
        deleteTransport: builder.mutation<{ success: boolean; message: string; data: any }, string>({
            query: (id) => ({
                url: `/transports/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Transport"],
        }),
    }),
});

export const {
    useGetAllTransportsQuery,
    useGetSingleTransportQuery,
    useAddTransportMutation,
    useUpdateTransportMutation,
    useDeleteTransportMutation,
} = transportApi;
