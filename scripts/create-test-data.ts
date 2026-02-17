import { prisma } from '../lib/prisma';

async function main() {
    console.log('Creating test data...');

    // Create Tenant
    const tenant = await prisma.tenant.upsert({
        where: { slug: 'test-company' },
        update: {},
        create: {
            name: 'Test Company',
            slug: 'test-company',
        },
    });

    console.log('✅ Tenant created:', tenant);

    // Create InboundEndpoint
    const endpoint = await prisma.inboundEndpoint.upsert({
        where: { url: 'my-key' },
        update: {},
        create: {
            tenantId: tenant.id,
            name: 'Test Webhook',
            url: 'my-key',
            isActive: true,
            mappingConfig: {},
        },
    });

    console.log('✅ InboundEndpoint created:', endpoint);

    console.log('\n✅ Test data ready!');
    console.log('\nNow test with n8n:');
    console.log('POST http://localhost:3000/api/inbound/test-company/my-key');
    console.log('Body: { "lead_name": "John Doe", "email": "john@example.com" }');
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
