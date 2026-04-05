export interface IContactNowCard {
    backgroundImage: string;
    title: string;
    description: string;
    contactNo: string;
}

export interface IHomeContent {
    contactNowCard: IContactNowCard | null;
    recentBlogs: any[];
    featuredTours: any[];
    popularTransports: any[];
}

export interface IHomeContentResponse {
    success: boolean;
    message: string;
    data: IHomeContent;
}
