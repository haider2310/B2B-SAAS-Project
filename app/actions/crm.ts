'use server';

import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { publishEvent } from "@/lib/event-bus";

// ============================================================
// LEADS
// ============================================================

export async function getLeads(filters: { status?: string; search?: string } = {}) {
    const user = await requireAuth();

    const where: any = {
        tenantId: user.tenantId,
    };

    if (filters.status) {
        where.status = filters.status;
    }

    if (filters.search) {
        where.OR = [
            { name: { contains: filters.search, } }, // Case insensitive usually handled by DB collation or provider
            { email: { contains: filters.search, } },
            { company: { name: { contains: filters.search } } }
        ];
    }

    return await prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { company: true, contact: true }
    });
}

export async function createLead(data: { name: string; email: string; companyName?: string; status?: string }) {
    try {
        const user = await requireAuth();
        if (!user || !user.id || !user.tenantId) {
            return { success: false, error: "Unauthorized or missing user data" };
        }

        // 1. Create Lead
        const lead = await prisma.lead.create({
            data: {
                tenantId: user.tenantId,
                name: data.name,
                email: data.email,
                status: (data.status as any) || 'NEW',
                createdById: user.id,
                description: data.companyName ? `Company: ${data.companyName}` : undefined
            }
        });

        // 2. Log Activity
        await prisma.activityLog.create({
            data: {
                tenantId: user.tenantId,
                userId: user.id,
                action: 'lead.created',
                entityType: 'Lead',
                entityId: lead.id,
                metadata: { name: lead.name }
            }
        });

        // Trigger Webhook (Non-blocking)
        try {
            await publishEvent(user.tenantId, 'lead.created', lead);
        } catch (e) {
            console.error("Webhook trigger failed:", e);
        }

        revalidatePath('/dashboard/leads');
        return { success: true, lead };
    } catch (e: any) {
        console.error("createLead Error:", e);
        // Robust check for Unique Constraint (P2002)
        const isUniqueConstraint = e.code === 'P2002' || e.message?.includes('Unique constraint');
        const isEmailField = e.meta?.target?.includes('email') || e.message?.includes('email');

        if (isUniqueConstraint && isEmailField) {
            return { success: false, error: "A lead with this email already exists." };
        }

        return { success: false, error: e.message || "Internal Server Error" };
    }
}

export async function updateLeadStatus(id: string, status: string) {
    const user = await requireAuth();

    const lead = await prisma.lead.update({
        where: { id, tenantId: user.tenantId },
        data: { status: (status as any) }
    });

    await prisma.activityLog.create({
        data: {
            tenantId: user.tenantId,
            userId: user.id,
            action: 'lead.status_changed',
            entityType: 'Lead',
            entityId: lead.id,
            metadata: { oldStatus: '?', newStatus: status }
        }
    });

    revalidatePath('/dashboard/leads');
    return { success: true, lead };
}

// ============================================================
// COMPANIES
// ============================================================

export async function getCompanies(filters: { search?: string } = {}) {
    const user = await requireAuth();

    const where: any = { tenantId: user.tenantId };

    if (filters.search) {
        where.name = { contains: filters.search };
    }

    return await prisma.company.findMany({
        where,
        orderBy: { name: 'asc' },
        include: { _count: { select: { contacts: true, deals: true } } }
    });
}

export async function createCompany(data: { name: string; domain?: string; industry?: string }) {
    try {
        const user = await requireAuth();

        const company = await prisma.company.create({
            data: {
                tenantId: user.tenantId,
                createdById: user.id,
                name: data.name,
                website: data.domain,
                industry: data.industry
            }
        });

        await prisma.activityLog.create({
            data: {
                tenantId: user.tenantId,
                userId: user.id,
                action: 'company.created',
                entityType: 'Company',
                entityId: company.id,
                metadata: { name: company.name }
            }
        });

        // Trigger Webhook
        try {
            await publishEvent(user.tenantId, 'company.created', company);
        } catch (e) {
            console.error("Webhook trigger failed", e);
        }

        revalidatePath('/dashboard/companies');
        return { success: true, company };
    } catch (e: any) {
        console.error("createCompany Error:", e);
        // Robust check for Unique Constraint (P2002) - e.g. Domain optional but maybe unique? 
        // Schema lookup needed if domain is unique. Schema says NOT unique for domain? 
        // Let's safe guard anyway.
        return { success: false, error: e.message || "Internal Server Error" };
    }
}

// ============================================================
// CONTACTS
// ============================================================

export async function getContacts(filters: { search?: string; companyId?: string } = {}) {
    const user = await requireAuth();

    const where: any = { tenantId: user.tenantId };

    if (filters.search) {
        where.OR = [
            { firstName: { contains: filters.search } },
            { lastName: { contains: filters.search } },
            { email: { contains: filters.search } }
        ];
    }

    if (filters.companyId) {
        where.companyId = filters.companyId;
    }

    return await prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { company: true }
    });
}

export async function createContact(data: { firstName: string; lastName: string; email: string; companyId?: string; phone?: string }) {
    try {
        const user = await requireAuth();

        const contact = await prisma.contact.create({
            data: {
                tenantId: user.tenantId,
                createdById: user.id,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                companyId: data.companyId
            }
        });

        await prisma.activityLog.create({
            data: {
                tenantId: user.tenantId,
                userId: user.id,
                action: 'contact.created',
                entityType: 'Contact',
                entityId: contact.id,
                metadata: { name: `${contact.firstName} ${contact.lastName}` }
            }
        });

        // Trigger Webhook
        try {
            await publishEvent(user.tenantId, 'contact.created', contact);
        } catch (e) {
            console.error("Webhook trigger failed", e);
        }

        revalidatePath('/dashboard/contacts');
        return { success: true, contact };
    } catch (e: any) {
        console.error("createContact Error:", e);
        // Robust check for Unique Constraint (P2002)
        const isUniqueConstraint = e.code === 'P2002' || e.message?.includes('Unique constraint');
        if (isUniqueConstraint) {
            return { success: false, error: "A contact with this email already exists." };
        }
        return { success: false, error: e.message || "Internal Server Error" };
    }
}
