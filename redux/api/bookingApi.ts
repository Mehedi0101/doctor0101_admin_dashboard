import { baseApi } from "./baseApi";
import { IAllBookingsResponse } from "@/types/booking";

export const bookingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllBookings: builder.query<IAllBookingsResponse, { page: number; limit: number; searchText?: string }>({
            query: (args) => ({
                url: "/bookings",
                method: "GET",
                params: args,
            }),
            providesTags: ["Booking"],
        }),
        updateBookingStatus: builder.mutation<any, { id: string; status: { booking?: string; payment?: string } }>({
            query: ({ id, status }) => ({
                url: `/bookings/status/${id}`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Booking"],
        }),
        deleteBooking: builder.mutation<any, string>({
            query: (id) => ({
                url: `/bookings/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Booking"],
        }),
    }),
});

export const {
    useGetAllBookingsQuery,
    useUpdateBookingStatusMutation,
    useDeleteBookingMutation,
} = bookingApi;
