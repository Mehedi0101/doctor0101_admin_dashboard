export interface IFAQ {
    question: string;
    answer: string;
}

export interface IPrivacyPolicy {
    title: string;
    description: string;
}

export interface ITermsAndCondition {
    title: string;
    description: string;
    clauses?: string[];
}

export interface ISiteContentResponse {
    faqs: IFAQ[];
    privacyPolicies: IPrivacyPolicy[];
    termsAndConditions: ITermsAndCondition[];
}
