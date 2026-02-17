
import { prisma } from '@/lib/prisma';

async function main() {
    console.log('Testing Lead Upsert...');

    const email = `test-lead-${Date.now()}@example.com`;
    const name = 'Test Lead';

    // 1. Create a dummy tenant and endpoint (needed for constraints, although we are testing Lead directly)
    // Actually, we can just test Lead creation directly with a known tenant if possible, 
    // but to be safe let's create a tenant.

    const tenant = await prisma.tenant.create({
        data: {
            name: 'Test Tenant',
            slug: `test-tenant-${Date.now()}`,
        }
    });

    console.log(`Created tenant: ${tenant.id}`);

    // 2. Upsert Lead (Simulate route logic)
    try {
        const lead = await prisma.lead.upsert({
            where: { email: email },
            update: {
                name: name
            },
            create: {
                tenantId: tenant.id,
                email: email,
                name: name,
                status: 'NEW',
                // createdById is optional now, so omitting it should work
            },
        });
        console.log(`Successfully upserted lead: ${lead.id}, Name: ${lead.name}, Email: ${lead.email}`);
    } catch (e) {
        console.error("Upsert failed:", e);
        process.exit(1);
    }

    // Clean up
    await prisma.tenant.delete({ where: { id: tenant.id } });
    console.log('Cleanup done.');
}

main();
