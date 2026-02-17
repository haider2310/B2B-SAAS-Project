import crypto from 'crypto';

export async function sendWebhook(
    url: string,
    payload: any,
    secret: string | null = null
): Promise<{ success: boolean; status: number; error?: string }> {
    try {
        const body = JSON.stringify(payload);
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'User-Agent': 'AntiGravity-B2B-SaaS/3.0',
        };

        if (secret) {
            const signature = crypto
                .createHmac('sha256', secret)
                .update(body)
                .digest('hex');
            headers['x-webhook-signature'] = signature;
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const res = await fetch(url, {
            method: 'POST',
            headers,
            body,
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!res.ok) {
            return { success: false, status: res.status, error: res.statusText };
        }

        return { success: true, status: res.status };

    } catch (e: any) {
        return { success: false, status: 0, error: e.message || 'Network Error' };
    }
}
