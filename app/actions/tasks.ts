'use server';

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { publishEvent } from "@/lib/event-bus";

// ============================================================
// TASKS
// ============================================================

export async function getTasks(filters: { view: 'my' | 'all' } = { view: 'my' }) {
    const user = await requireAuth();

    const where: any = { tenantId: user.tenantId };

    if (filters.view === 'my') {
        where.assignedToId = user.id;
    }

    return await prisma.task.findMany({
        where,
        orderBy: [
            { status: 'asc' }, // TODO first
            { dueDate: 'asc' } // Earliest due first
        ],
        include: {
            createdBy: { select: { name: true } },
            assignedTo: { select: { name: true } }
        }
    });
}

export async function createTask(data: { title: string; description?: string; dueDate?: Date; priority?: string; assignedToId?: string }) {
    try {
        const user = await requireAuth();

        const task = await prisma.task.create({
            data: {
                tenantId: user.tenantId,
                createdById: user.id,
                title: data.title,
                description: data.description,
                dueDate: data.dueDate,
                priority: (data.priority as any) || 'MEDIUM',
                assignedToId: data.assignedToId || user.id // Self-assign by default
            }
        });

        await prisma.activityLog.create({
            data: {
                tenantId: user.tenantId,
                userId: user.id,
                action: 'task.created',
                entityType: 'Task',
                entityId: task.id,
                metadata: { title: task.title }
            }
        });

        // Trigger Webhook
        try {
            await publishEvent(user.tenantId, 'task.created', task);
        } catch (e) {
            console.error("Webhook trigger failed", e);
        }

        revalidatePath('/dashboard/tasks');
        return { success: true, task };
    } catch (e: any) {
        console.error("createTask Error:", e);
        return { success: false, error: e.message || "Internal Server Error" };
    }
}

export async function toggleTaskCompletion(id: string, isCompleted: boolean) {
    const user = await requireAuth();

    const task = await prisma.task.update({
        where: { id, tenantId: user.tenantId },
        data: {
            status: isCompleted ? 'COMPLETED' : 'TODO',
            completedAt: isCompleted ? new Date() : null
        }
    });

    revalidatePath('/dashboard/tasks');
    return { success: true, task };
}
