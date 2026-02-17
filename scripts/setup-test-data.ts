import { prisma } from '../lib/prisma';

async function setupTestData() {
    console.log('🔧 Setting up test data...\n');

    // Create a test tenant
    const tenant = await prisma.tenant.upsert({
        where: { slug: 'test-company' },
        update: {},
        create: {
            name: 'Test Company',
            slug: 'test-company',
        },
    });
    console.log('✅ Tenant created:', tenant);

    // Create an inbound endpoint
    const endpoint = await prisma.inboundEndpoint.upsert({
        where: { url: 'my-key' },
        update: {},
        create: {
            tenantId: tenant.id,
            name: 'Test Webhook',
            url: 'my-key',
            mappingConfig: {
                fields: {
                    name: 'contact.name',
                    email: 'contact.email',
                },
            },
            isActive: true,
        },
    });
    console.log('✅ Endpoint created:', endpoint);

    console.log('\n✨ Test data ready!');
    console.log('📍 Webhook URL: http://localhost:3001/api/inbound/test-company/my-key');
}

setupTestData()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
