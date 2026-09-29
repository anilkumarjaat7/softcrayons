"use client";

import * as React from "react";
import { authClient } from "@/lib/auth-client";

export type AuthUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  phone: string | null;
  emailVerified: boolean;
  banned: boolean;
  banReason: string | null;
  banExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  refresh: async () => {},
});

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  const user = React.useMemo<AuthUser | null>(() => {
    if (!session?.user) return null;
    const u = session.user as Record<string, unknown>;
    return {
      id: u.id as string,
      name: (u.name as string | null) ?? null,
      email: u.email as string,
      image: (u.image as string | null) ?? null,
      role: (u.role as string) || "STUDENT",
      phone: (u.phone as string | null) ?? null,
      emailVerified: (u.emailVerified as boolean) ?? false,
      banned: (u.banned as boolean) ?? false,
      banReason: (u.banReason as string | null) ?? null,
      banExpires: u.banExpires ? new Date(u.banExpires as string) : null,
      createdAt: new Date(u.createdAt as string),
      updatedAt: new Date(u.updatedAt as string),
    };
  }, [session]);

  const refresh = React.useCallback(async () => {
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isPending,
        isAuthenticated: !!session?.user,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
