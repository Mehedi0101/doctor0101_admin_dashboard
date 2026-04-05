export type TTourType = "group" | "individual";

export interface ITour {
    _id?: string;
    title: string;
    description: string;
    location: string;
    duration: string;
    type: TTourType;
    image: string;
    features?: string[];
    frequency?: string;
    totalSpot?: number;
    availableSpot?: number;
    featured?: boolean;
    includedItems?: string[];
    contactNo: string;
    isDeleted?: boolean;
}

export interface ITourResponse {
    success: boolean;
    message: string;
    data: ITour;
}

export interface IToursResponse {
    success: boolean;
    message: string;
    data: ITour[];
}
