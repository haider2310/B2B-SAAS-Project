import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from 'crypto';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ tenantSlug: string; endpointKey: string }> }
) {
    const { tenantSlug, endpointKey } = await params;
    const bodyText = await req.text();
    let body;

    try {
        body = JSON.parse(bodyText);
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // 1. Find Endpoint & Tenant
    const endpoint = await prisma.inboundEndpoint.findFirst({
        where: {
            endpointKey,
            tenant: { slug: tenantSlug },
            isActive: true
        },
        include: { tenant: true }
    });

    if (!endpoint) {
        return NextResponse.json({ error: "Endpoint not found or inactive" }, { status: 404 });
    }

    // 2. Validate Signature (if AuthType is HMAC/API_KEY)
    if (endpoint.authType === 'HMAC' && endpoint.secretHash) {
        const signature = req.headers.get('x-webhook-signature');
        if (!signature) {
            await logEvent(endpoint.id, endpoint.tenantId, body, req, "failed", "Missing signature");
            return NextResponse.json({ error: "Missing signature" }, { status: 401 });
        }

        const expectedSignature = crypto
            .createHmac('sha256', endpoint.secretHash)
            .update(bodyText)
            .digest('hex');

        if (signature !== expectedSignature) {
            await logEvent(endpoint.id, endpoint.tenantId, body, req, "failed", "Invalid signature");
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }
    }

    // 3. Process Payload (Simple Mapping Engine)
    // Expecting standard keys for now: email, name, company, etc.
    // In V3.0 full version, we would use endpoint.mappingConfig to map fields dynamically.
    const payload = body;
    const email = payload.email || payload.contact_email;
    const name = payload.name || payload.contact_name || payload.full_name;
    const companyName = payload.company || payload.company_name;

    if (!email) {
        await logEvent(endpoint.id, endpoint.tenantId, body, req, "rejected", "Missing email field");
        return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // 4. Deduplication / Upsert Logic
    // Strategy: Try to find Contact by email. If exists, update. If not, create Lead (or Contact).
    // Requirement says: "Convert leads to customers". Let's assume inbound = Lead unless specified.

    let resultEntityId = null;
    let resultType = "";

    try {
        // Check for existing Contact
        const existingContact = await prisma.contact.findFirst({
            where: { tenantId: endpoint.tenantId, email }
        });

        if (existingContact) {
            // Update Contact? Or just log activity?
            // Let's create a Note or ActivityLog for now to avoid overwriting sensitive data without explicit instruction
            await prisma.activityLog.create({
                data: {
                    tenantId: endpoint.tenantId,
                    userId: existingContact.createdById, // Blame the creator? Or null for system
                    action: 'inbound.webhook_received',
                    entityType: 'Contact',
                    entityId: existingContact.id,
                    metadata: { source: 'n8n', payload }
                }
            });
            resultEntityId = existingContact.id;
            resultType = "Contact (Updated)";
        } else {
            // Check for existing Lead
            const existingLead = await prisma.lead.findFirst({
                where: { tenantId: endpoint.tenantId, email }
            });

            if (existingLead) {
                // Update Lead
                await prisma.lead.update({
                    where: { id: existingLead.id },
                    data: {
                        name: name || existingLead.name,
                        description: payload.message ? `${existingLead.description}\n\nNew Message: ${payload.message}` : existingLead.description
                    }
                });
                resultEntityId = existingLead.id;
                resultType = "Lead (Updated)";
            } else {
                // Create New Lead
                // We need a system user or use the endpoint creator as blame? 
                // Using a default system logic or the first admin of the tenant?
                // For now, let's leave createdById nullable in schema if possible, or pick the first user.
                // Schema has `createdById String?` for Lead. Good.

                const newLead = await prisma.lead.create({
                    data: {
                        tenantId: endpoint.tenantId,
                        email,
                        name: name || 'Unknown Inbound',
                        source: 'n8n Inbound',
                        status: 'NEW',
                        description: payload.message || JSON.stringify(payload)
                    }
                });
                resultEntityId = newLead.id;
                resultType = "Lead (Created)";
            }
        }

        // 5. SUCCESS LOG
        await logEvent(endpoint.id, endpoint.tenantId, body, req, "processed", null, {
            entityId: resultEntityId,
            action: resultType
        });

        return NextResponse.json({ success: true, id: resultEntityId, type: resultType });

    } catch (e: any) {
        console.error("Inbound processing error:", e);
        await logEvent(endpoint.id, endpoint.tenantId, body, req, "failed", e.message || "Internal Server Error");
        return NextResponse.json({ error: "Processing failed" }, { status: 500 });
    }
}

async function logEvent(
    endpointId: string,
    tenantId: string,
    payload: any,
    req: NextRequest,
    status: string,
    error: string | null = null,
    resultRefs: any = null
) {
    await prisma.inboundEvent.create({
        data: {
            tenantId,
            inboundEndpointId: endpointId,
            payload,
            status,
            error,
            sourceIp: req.headers.get('x-forwarded-for') || 'unknown',
            headers: Object.fromEntries(req.headers.entries()),
            resultStatus: status,
            createdEntityRefs: resultRefs, // JSON
            processedAt: new Date()
        }
    });
}