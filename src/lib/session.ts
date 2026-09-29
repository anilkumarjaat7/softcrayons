import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}

export async function requireAuth() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/sign-in");
  }

  return { session, user };
}

export async function requireRole(allowedRoles: string[]) {
  const session = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !allowedRoles.includes(user.role)) {
    redirect("/sign-in");
  }

  return { session, user };
}
