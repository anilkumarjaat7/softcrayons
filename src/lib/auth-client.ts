import { createAuthClient } from "better-auth/react";
import { adminClient, emailOTPClient, magicLinkClient } from "better-auth/client/plugins";

const getBaseURL = () => {
    if (typeof window !== "undefined") {
        return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
    baseURL: getBaseURL(),
    plugins: [adminClient(), magicLinkClient(), emailOTPClient()],
});

export const {
    signIn,
    signOut,
    useSession,
    getSession,
} = authClient;