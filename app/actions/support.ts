'use server';

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { publishEvent } from "@/lib/event-bus";

// ============================================================
// TICKETS
// ============================================================

export async function getTickets(filters: { status?: string; priority?: string } = {}) {
    const user = await requireAuth();

    const where: any = { tenantId: user.tenantId };

    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;

    return await prisma.ticket.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        include: {
            assignedTo: { select: { name: true, avatar: true } },
            contact: { select: { firstName: true, lastName: true, email: true } }
        }
    });
}

export async function createTicket(data: { title: string; description?: string; priority: string; contactId?: string }) {
    try {
        const user = await requireAuth();

        const ticket = await prisma.ticket.create({
            data: {
                tenantId: user.tenantId,
                createdById: user.id,
                title: data.title,
                description: data.description,
                priority: (data.priority as any) || 'MEDIUM',
                status: 'OPEN',
                contactId: data.contactId,
                assignedToId: user.id // Auto-assign to creator for now, or leave null
            }
        });

        await prisma.activityLog.create({
            data: {
                tenantId: user.tenantId,
                userId: user.id,
                action: 'ticket.created',
                entityType: 'Ticket',
                entityId: ticket.id,
                metadata: { title: ticket.title }
            }
        });

        // Trigger Webhook
        try {
            await publishEvent(user.tenantId, 'ticket.created', ticket);
        } catch (e) {
            console.error("Webhook trigger failed", e);
        }

        revalidatePath('/dashboard/support');
        return { success: true, ticket };
    } catch (e: any) {
        console.error("createTicket Error:", e);
        return { success: false, error: e.message || "Internal Server Error" };
    }
}

export async function updateTicketStatus(id: string, status: string) {
    const user = await requireAuth();

    const ticket = await prisma.ticket.update({
        where: { id, tenantId: user.tenantId },
        data: {
            status: status as any,
            resolvedAt: status === 'RESOLVED' || status === 'CLOSED' ? new Date() : null
        }
    });

    revalidatePath('/dashboard/support');
    return { success: true, ticket };
}

export async function addTicketNote(id: string, content: string) {
    const user = await requireAuth();

    const note = await prisma.note.create({
        data: {
            tenantId: user.tenantId,
            createdById: user.id,
            ticketId: id,
            content
        }
    });

    return { success: true, note };
}
