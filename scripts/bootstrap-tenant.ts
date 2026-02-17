import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma"; // Use the singleton instance

async function main() {
    const tenantSlug = "demo-inc";
    const adminEmail = "admin@demo.com";
    const adminPassword = "password123";

    console.log(`Bootstrapping tenant: ${tenantSlug}...`);

    // 1. Create or Update Tenant
    const tenant = await prisma.tenant.upsert({
        where: { slug: tenantSlug },
        update: {},
        create: {
            name: "Demo Inc.",
            slug: tenantSlug,
            domain: "demo.com",
        }
    });

    console.log(`Tenant secured: ${tenant.id}`);

    // 2. Create Admin User
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const user = await prisma.user.upsert({
        where: {
            tenantId_email: {
                tenantId: tenant.id,
                email: adminEmail
            }
        },
        update: {
            password: hashedPassword,
            role: "OWNER"
        },
        create: {
            tenantId: tenant.id,
            email: adminEmail,
            name: "Admin User",
            password: hashedPassword,
            role: "OWNER"
        }
    });

    console.log(`Admin user ready: ${user.email} (Password: ${adminPassword})`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
