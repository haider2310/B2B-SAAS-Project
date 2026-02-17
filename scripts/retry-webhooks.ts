
import { retryWebhookDeliveries } from '../lib/event-bus';

async function main() {
    console.log('Starting retry worker...');
    try {
        const result = await retryWebhookDeliveries();
        console.log('Retry Worker Result:', result);
    } catch (error) {
        console.error('Retry Worker Failed:', error);
    }
}

main();
