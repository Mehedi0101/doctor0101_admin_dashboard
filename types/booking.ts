export interface IBookingSummary {
    totalCount: number;
    confirmedCount: number;
    inProgressCount: number;
    cancelledCount: number;
}

export interface IBookingData {
    _id: string;
    title: string;
    customerName: string;
    customerEmail: string;
    customerContact: string;
    customerImage?: string;
    pickup: string;
    destination: string;
    totalPassengers: number;
    price: number;
    bookingDate: Date | string;
    bookingStatus: string;
    paymentStatus: string;
}

export interface IBookingMeta {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

export interface IAllBookingsResponse {
    success: boolean;
    message: string;
    summary: IBookingSummary;
    meta: IBookingMeta;
    data: IBookingData[];
}
