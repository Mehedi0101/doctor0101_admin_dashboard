export interface IBlogOverviewItem {
    _id: string;
    title: string;
    image: string;
    createdAt: string;
    readtime: number;
    overview: string;
}

export interface IBlogCategorizedResponse {
    featured: IBlogOverviewItem[];
    recent: IBlogOverviewItem[];
    all: IBlogOverviewItem[];
}

export interface IBlogDetails {
    _id: string;
    title: string;
    image: string;
    category: string;
    readtime: number;
    createdAt: string;
    description: string;
    likeCount: number;
    isLiked: boolean;
}
