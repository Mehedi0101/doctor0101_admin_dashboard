import { baseApi } from "./baseApi";

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createNotification: builder.mutation<any, { title: string; message: string }>({
            query: (data) => ({
                url: "/notifications",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Notification"],
        }),
        getAllNotifications: builder.query<any, void>({
            query: () => ({
                url: "/notifications",
                method: "GET",
            }),
            providesTags: ["Notification"],
        }),
        deleteNotification: builder.mutation<any, string>({
            query: (id) => ({
                url: `/notifications/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Notification"],
        }),
    }),
});

export const {
    useCreateNotificationMutation,
    useGetAllNotificationsQuery,
    useDeleteNotificationMutation,
} = notificationApi;
