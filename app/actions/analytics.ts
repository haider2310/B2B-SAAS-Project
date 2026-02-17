'use server';

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function getDashboardStats() {
    const user = await requireAuth();
    const tenantId = user.tenantId;

    // 1. Pipeline Value (Sum of all open deals)
    const pipelineValue = await prisma.deal.aggregate({
        where: {
            tenantId,
            status: 'OPEN'
        },
        _sum: { value: true }
    });

    // 2. Total Leads
    const totalLeads = await prisma.lead.count({ where: { tenantId } });

    // 3. Won Deals
    const wonDeals = await prisma.deal.count({ where: { tenantId, status: 'WON' } });

    // 4. Conversion Rate
    const conversionRate = totalLeads > 0 ? (wonDeals / totalLeads) * 100 : 0;

    // 5. Open Tickets
    const openTickets = await prisma.ticket.count({
        where: {
            tenantId,
            status: { notIn: ['RESOLVED', 'CLOSED'] }
        }
    });

    // 6. Pipeline by Stage (for Chart)
    const dealsByStage = await prisma.deal.groupBy({
        by: ['stage'],
        where: { tenantId, status: 'OPEN' },
        _sum: { value: true },
        _count: { id: true }
    });

    // 7. Recent Activity
    const recentActivity = await prisma.activityLog.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { user: { select: { name: true } } }
    });

    return {
        pipelineValue: pipelineValue._sum.value || 0,
        totalLeads,
        wonDeals,
        conversionRate: parseFloat(conversionRate.toFixed(1)),
        openTickets,
        dealsByStage: dealsByStage.map(d => ({
            stage: d.stage,
            value: d._sum.value || 0,
            count: d._count.id
        })),
        recentActivity: recentActivity.map(a => ({
            id: a.id,
            action: a.action,
            user: a.user?.name || 'System',
            createdAt: a.createdAt,
            details: JSON.stringify(a.metadata)
        }))
    };
}
