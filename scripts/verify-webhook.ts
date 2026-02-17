import { prisma } from '../lib/prisma';

async function verifyWebhook() {
    console.log('🔍 Verifying webhook data...');

    const events = await prisma.inboundEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: { inboundEndpoint: true }
    });

    if (events.length === 0) {
        console.log('❌ No inbound events found.');
        process.exit(1);
    }

    const event = events[0];
    console.log('✅ Inbound Event found:');
    console.log(`- ID: ${event.id}`);
    console.log(`- Status: ${event.status}`);
    console.log(`- Payload:`, event.payload);
    console.log(`- Endpoint: ${event.inboundEndpoint.name} (${event.inboundEndpoint.url})`);

    await prisma.$disconnect();
}

verifyWebhook().catch(console.error);
