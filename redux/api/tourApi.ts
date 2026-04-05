import { baseApi } from "./baseApi";
import { ITourResponse, IToursResponse } from "@/types/tour";

export const tourApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllTours: builder.query<IToursResponse, string | void>({
            query: (params) => ({
                url: "/tours",
                params: params ? JSON.parse(params) : undefined,
            }),
            providesTags: ["Tour"],
        }),
        getSingleTour: builder.query<ITourResponse, string>({
            query: (id) => `/tours/${id}`,
            providesTags: (result, error, id) => [{ type: "Tour", id }],
        }),
        addTour: builder.mutation<ITourResponse, FormData>({
            query: (data) => ({
                url: "/tours",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Tour"],
        }),
        updateTour: builder.mutation<ITourResponse, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/tours/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ["Tour", { type: "Tour", id }],
        }),
        toggleFeaturedStatus: builder.mutation<ITourResponse, string>({
            query: (id) => ({
                url: `/tours/toggle-featured/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: (result, error, id) => ["Tour", { type: "Tour", id }],
        }),
        deleteTour: builder.mutation<{ success: boolean; message: string; data: any }, string>({
            query: (id) => ({
                url: `/tours/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Tour"],
        }),
    }),
});

export const {
    useGetAllToursQuery,
    useGetSingleTourQuery,
    useAddTourMutation,
    useUpdateTourMutation,
    useToggleFeaturedStatusMutation,
    useDeleteTourMutation,
} = tourApi;
