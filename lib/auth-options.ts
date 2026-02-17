import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // Check for user across all tenants? Or just find first match?
                // For login, we typically need to know the tenant OR email must be globally unique.
                // In this schema, email is unique per tenant.
                // If we want to allow login by just email, we assume email is unique enough or pick the first one.
                // For safety in this MVP, let's use findFirst.
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user || !user.password) {
                    return null;
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    return null;
                }

                return user;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string;
                // Fetch tenantId if needed, bit risky in session callback payload size vs db call
                // But for now, user.id is enough to fetch details in server actions
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || 'super-secret-secret',
};
