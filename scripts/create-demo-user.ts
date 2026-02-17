
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

async function main() {
    console.log('Seeding demo user...');

    // 1. Create/Get Tenant
    const tenant = await prisma.tenant.upsert({
        where: { slug: 'demo-corp' },
        update: {},
        create: {
            name: 'Demo Corp',
            slug: 'demo-corp',
            domain: 'demo.com',
        },
    });

    console.log(`Tenant created: ${tenant.name} (${tenant.id})`);

    // 2. Create/Get User
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = await prisma.user.upsert({
        where: {
            tenantId_email: {
                tenantId: tenant.id,
                email: 'demo@snapcut.ai'
            }
        },
        update: {
            password: hashedPassword, // Ensure password is set/updated
            role: 'OWNER',
            name: 'Demo User',
            image: 'https://ui-avatars.com/api/?name=Demo+User&background=random'
        },
        create: {
            email: 'demo@snapcut.ai',
            name: 'Demo User',
            password: hashedPassword,
            role: 'OWNER',
            tenantId: tenant.id,
            image: 'https://ui-avatars.com/api/?name=Demo+User&background=random'
        },
    });

    console.log(`User created: ${user.email} (Password: password123)`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
