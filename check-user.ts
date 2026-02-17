import { prisma } from './lib/prisma';

async function main() {
    console.log('Checking for admin user...');
    const user = await prisma.user.findUnique({
        where: { email: 'admin@demo.com' }
    });

    if (user) {
        console.log('User found:', user.email, 'Tenant:', user.tenantId);
    } else {
        console.log('User NOT found!');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
