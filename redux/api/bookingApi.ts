import { baseApi } from "./baseApi";
import { IAllBookingsResponse } from "@/types/booking";

export const bookingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllBookings: builder.query<IAllBookingsResponse, { page: number; limit: number; searchText?: string }>({
            query: (args) => {
                return {
                    url: "/bookings",
                    method: "GET",
                    params: args,
                };
            },
            providesTags: ["Booking"],
        }),
    }),
});

export const {
    useGetAllBookingsQuery,
} = bookingApi;
