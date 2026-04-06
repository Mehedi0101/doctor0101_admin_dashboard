import { IFAQ } from "@/types/siteContent";
import { baseApi } from "./baseApi";

export const siteContentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFaqs: builder.query<{ data: IFAQ[], success: boolean, message: string }, void>({
            query: () => ({
                url: "/site-contents/faqs",
                method: "GET",
            }),
            providesTags: ["SiteContent"],
        }),
        updateFaqs: builder.mutation<any, IFAQ[]>({
            query: (faqs) => ({
                url: "/site-contents/faqs",
                method: "PATCH",
                body: faqs,
            }),
            invalidatesTags: ["SiteContent"],
        }),
        getPrivacyPolicy: builder.query<{ data: { title: string, description: string }[], success: boolean, message: string }, void>({
            query: () => ({
                url: "/site-contents/privacy-policy",
                method: "GET",
            }),
            providesTags: ["SiteContent"],
        }),
        updatePrivacyPolicy: builder.mutation<any, { title: string, description: string }[]>({
            query: (policy) => ({
                url: "/site-contents/privacy-policy",
                method: "PATCH",
                body: policy,
            }),
            invalidatesTags: ["SiteContent"],
        }),
        getTermsAndConditions: builder.query<{ data: { title: string, description: string, clauses: string[] }[], success: boolean, message: string }, void>({
            query: () => ({
                url: "/site-contents/terms-and-conditions",
                method: "GET",
            }),
            providesTags: ["SiteContent"],
        }),
        updateTermsAndConditions: builder.mutation<any, { title: string, description: string, clauses: string[] }[]>({
            query: (terms) => ({
                url: "/site-contents/terms-and-conditions",
                method: "PATCH",
                body: terms,
            }),
            invalidatesTags: ["SiteContent"],
        }),
    }),
});

export const {
    useGetFaqsQuery,
    useUpdateFaqsMutation,
    useGetPrivacyPolicyQuery,
    useUpdatePrivacyPolicyMutation,
    useGetTermsAndConditionsQuery,
    useUpdateTermsAndConditionsMutation,
} = siteContentApi;
