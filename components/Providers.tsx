"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { Toaster } from "sonner"; // Let's also put our Toast helper here

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            {children}
            <Toaster position="top-right" richColors />
        </Provider>
    );
}
