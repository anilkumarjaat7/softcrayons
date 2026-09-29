import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const headersList = await headers();
        
        const session = await auth.api.getSession({
            headers: headersList,
        });
        
        if (!session) {
            return NextResponse.json({ 
                error: "No session found",
                cookies: headersList.get("cookie") ? "present" : "missing",
            }, { status: 401 });
        }
        
        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                email: true,
                role: true,
                name: true,
                banned: true,
            }
        });
        
        return NextResponse.json({
            sessionUser: session.user,
            sessionRole: session.user.role,
            sessionRoleType: typeof session.user.role,
            databaseUser: dbUser,
            databaseRole: dbUser?.role,
            databaseRoleType: typeof dbUser?.role,
            isAdminCheck: ["ADMIN", "admin"].includes(session.user.role as string),
        });
    } catch (error) {
        console.error("[Debug Session] Error:", error);
        return NextResponse.json({ 
            error: "Failed to get session",
            details: error instanceof Error ? error.message : String(error),
        }, { status: 500 });
    }
}
