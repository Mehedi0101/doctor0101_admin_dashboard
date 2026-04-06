import { baseApi } from "./baseApi";
import { IBlogCategorizedResponse, IBlogDetails } from "@/types/blog";

export const blogApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBlog: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: "/blogs",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Blog"],
        }),
        getAllBlogs: builder.query<{ data: IBlogCategorizedResponse, success: boolean, message: string }, void>({
            query: () => ({
                url: "/blogs",
                method: "GET",
            }),
            providesTags: ["Blog"],
        }),
        getSingleBlog: builder.query<{ data: IBlogDetails, success: boolean, message: string }, string>({
            query: (id) => ({
                url: `/blogs/${id}`,
                method: "GET",
            }),
            providesTags: ["Blog"],
        }),
        updateBlog: builder.mutation<any, { id: string; formData: FormData }>({
            query: ({ id, formData }) => ({
                url: `/blogs/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: ["Blog"],
        }),
        deleteBlog: builder.mutation<any, string>({
            query: (id) => ({
                url: `/blogs/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Blog"],
        }),
        makeBlogFeatured: builder.mutation<any, string>({
            query: (id) => ({
                url: `/blogs/select-featured/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Blog"],
        }),
    }),
});

export const {
    useCreateBlogMutation,
    useGetAllBlogsQuery,
    useGetSingleBlogQuery,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
    useMakeBlogFeaturedMutation,
} = blogApi;
