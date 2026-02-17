'use server';

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import crypto from 'crypto';

// ============================================================
// INBOUND ENDPOINTS
// ============================================================

export async function getInboundEndpoints() {
    const user = await requireAuth();

    return await prisma.inboundEndpoint.findMany({
        where: { tenantId: user.tenantId },
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { inboundEvents: true } } }
    });
}

export async function createInboundEndpoint(data: { name: string; mappingConfig?: any }) {
    try {
        const user = await requireAuth();

        // Generate a secure random key
        const endpointKey = crypto.randomBytes(16).toString('hex');

        const endpoint = await prisma.inboundEndpoint.create({
            data: {
                tenantId: user.tenantId,
                name: data.name,
                endpointKey: endpointKey,
                mappingConfig: data.mappingConfig || {},
                authType: 'NONE', // Default
                isActive: true
            }
        });

        revalidatePath('/dashboard/automation/inbound');
        return { success: true, endpoint };
    } catch (error) {
        console.error("Failed to create inbound endpoint:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function rotateEndpointSecret(id: string) {
    const user = await requireAuth();

    // Generate new secret for HMAC
    const newSecret = crypto.randomBytes(32).toString('hex');

    await prisma.inboundEndpoint.update({
        where: { id, tenantId: user.tenantId },
        data: { secretHash: newSecret, authType: 'HMAC' } // Switch to HMAC on rotation if desired, or just update secret
    });

    revalidatePath('/dashboard/automation/inbound');
    return { success: true, secret: newSecret };
}

export async function toggleEndpointStatus(id: string, isActive: boolean) {
    const user = await requireAuth();

    await prisma.inboundEndpoint.update({
        where: { id, tenantId: user.tenantId },
        data: { isActive }
    });

    revalidatePath('/dashboard/automation/inbound');
    return { success: true };
}

// ============================================================
// EVENTS
// ============================================================

export async function getInboundEvents(endpointId: string) {
    const user = await requireAuth();

    // Ensure endpoint belongs to tenant
    const endpoint = await prisma.inboundEndpoint.findUnique({
        where: { id: endpointId, tenantId: user.tenantId }
    });

    if (!endpoint) return [];

    return await prisma.inboundEvent.findMany({
        where: { inboundEndpointId: endpointId },
        orderBy: { createdAt: 'desc' },
        take: 50 // Limit for performance
    });
}
