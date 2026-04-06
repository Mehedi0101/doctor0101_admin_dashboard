import { baseApi } from "./baseApi";

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
    }),
});

export const {
    useCreateBlogMutation,
} = blogApi;
