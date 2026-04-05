export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "user";
}

export interface ILoginInput {
    email: string;
    password: string;
}

export interface ILoginResponse {
    success: boolean;
    message: string;
    data: {
        accessToken: string;
        user: IUser;
    };
}

export interface AuthState {
    user: IUser | null;
    token: string | null;
    isInitialized: boolean;
}
