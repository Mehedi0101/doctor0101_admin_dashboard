import { useEffect } from "react";
import { useGetMeQuery } from "@/redux/api/userApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser, setInitialized, logout } from "@/store/slices/authSlice"; // Ensure setUser is here

export function useInitializeAuth() {
    const dispatch = useAppDispatch();
    const isInitialized = useAppSelector((state) => state.auth.isInitialized);

    const { data, isSuccess, isError } = useGetMeQuery(undefined, {
        skip: isInitialized,
    });

    useEffect(() => {
        if (isSuccess && data?.success) {
            dispatch(setUser(data.data)); // This calls the setUser we just added back
            dispatch(setInitialized());
        }
    }, [isSuccess, data, dispatch]);

    useEffect(() => {
        if (isError) {
            dispatch(logout());
        }
    }, [isError, dispatch]);
}
