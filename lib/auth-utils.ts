import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";

export async function getCurrentUser() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;

    const user = await prisma.user.findFirst({
        where: { email: session.user.email },
        include: { tenant: true }
    });

    return user;
}

export function checkPermission(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy: Record<UserRole, number> = {
        OWNER: 100,
        ADMIN: 80,
        MANAGER: 60,
        SALES_REP: 40,
        SUPPORT_AGENT: 20,
        VIEWER: 10
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("Unauthorized");
    }
    return user;
}
