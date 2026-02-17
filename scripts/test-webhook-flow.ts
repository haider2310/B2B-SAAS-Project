import { prisma } from '../lib/prisma';

async function testWebhookFlow() {
    console.log('🚀 Starting Webhook Flow Test...');

    const url = 'http://localhost:3000/api/inbound/test-company/my-key';
    const payload = {
        lead_name: "John Doe",
        email: "john@example.com",
        source: "test-script"
    };

    try {
        // 1. Send POST request
        console.log(`\n📤 Sending POST request to ${url}...`);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        console.log(`📥 Response Status: ${response.status}`);
        const responseBody = await response.json();
        console.log('📥 Response Body:', responseBody);

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        console.log('\n✅ Request successful! Checking database...');

        // 2. Verify Database
        // Wait a brief moment to ensure DB write (though it should be awaited in the route)
        await new Promise(resolve => setTimeout(resolve, 1000));

        const event = await prisma.inboundEvent.findFirst({
            where: {
                inboundEndpoint: {
                    url: 'my-key'
                }
            },
            orderBy: { createdAt: 'desc' },
            include: { inboundEndpoint: true }
        });

        if (!event) {
            console.error('❌ Verification Failed: No inbound event found in database.');
            process.exit(1);
        }

        console.log('✅ Database Verification Successful!');
        console.log(`- Event ID: ${event.id}`);
        console.log(`- Status: ${event.status}`);
        console.log(`- Payload:`, event.payload);
        console.log(`- Created At: ${event.createdAt}`);

    } catch (error) {
        console.error('❌ Test Failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

testWebhookFlow();
