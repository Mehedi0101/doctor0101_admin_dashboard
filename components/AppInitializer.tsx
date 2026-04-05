"use client";

import { useInitializeAuth } from "@/hooks/useInitializeAuth";

/**
 * AppInitializer
 *
 * A renderless client component that calls `useInitializeAuth` once at app startup.
 * It must live inside `<Providers>` (inside the Redux Provider) to have access to dispatch.
 * It renders nothing — it only runs the side-effect of checking the session.
 */
export function AppInitializer() {
    useInitializeAuth();
    return null;
}
