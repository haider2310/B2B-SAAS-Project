import { prisma } from './lib/prisma';
import bcrypt from 'bcrypt';

async function main() {
    console.log('🌱 Seeding database...');

    // 1. Ensure Tenant & User
    let tenant = await prisma.tenant.findFirst({ where: { name: 'Demo Inc.' } });
    if (!tenant) {
        tenant = await prisma.tenant.create({
            data: { name: 'Demo Inc.', slug: 'demo', plan: 'ENTERPRISE' }
        });
        console.log('✅ Created Tenant: Demo Inc.');
    }

    const hashedPassword = await bcrypt.hash('password123', 10);
    let user = await prisma.user.findFirst({ where: { email: 'admin@demo.com' } });

    if (!user) {
        user = await prisma.user.create({
            data: {
                tenantId: tenant.id,
                email: 'admin@demo.com',
                name: 'Admin User',
                password: hashedPassword,
                role: 'ADMIN'
            }
        });
        console.log('✅ Created User: admin@demo.com');
    } else {
        // Ensure user is linked to correct tenant if it existed
        await prisma.user.update({
            where: { id: user.id },
            data: { tenantId: tenant.id, password: hashedPassword } // Reset password just in case
        });
        console.log('ℹ️ User exists, updated tenant/password.');
    }

    const tenantId = tenant.id;
    const userId = user.id;

    console.log('🧹 Cleaning up old data...');
    // Delete in order to avoid FK constraints if simplified, but with Cascade simpler
    // Note: prisma relations might require specific order or Cascade delete handle it.
    // Let's delete from child to parent or rely on Cascade if configured.
    // Our schema has onDelete: Cascade for most tenant relations.

    // Explicitly delete to be safe and clear (Deals, Leads, Contacts, Companies)
    await prisma.ticket.deleteMany({ where: { tenantId } });
    await prisma.deal.deleteMany({ where: { tenantId } });
    await prisma.lead.deleteMany({ where: { tenantId } });
    await prisma.contact.deleteMany({ where: { tenantId } });
    await prisma.company.deleteMany({ where: { tenantId } });
    await prisma.inboundEndpoint.deleteMany({ where: { tenantId } });
    await prisma.outboundWebhookSubscription.deleteMany({ where: { tenantId } });

    console.log('🧹 Cleanup complete.');

    // 2. Create Companies
    const companies = [];
    const companyNames = ['Acme Corp', 'Globex', 'Soylent Corp', 'Umbrella Corp', 'Stark Ind'];
    for (const name of companyNames) {
        const c = await prisma.company.create({
            data: {
                tenant: { connect: { id: tenantId } },
                name,
                industry: 'Tech',
                website: `${name.toLowerCase().replace(' ', '')}.com`,
                createdBy: { connect: { id: userId } }
            }
        });
        companies.push(c);
    }
    console.log(`✅ Created ${companies.length} Companies`);

    // 3. Create Contacts
    const contacts = [];
    for (let i = 0; i < 10; i++) {
        const c = await prisma.contact.create({
            data: {
                tenant: { connect: { id: tenantId } },
                firstName: `Contact`,
                lastName: `${i + 1}`,
                email: `contact${i + 1}@example.com`,
                company: { connect: { id: companies[i % companies.length].id } },
                createdBy: { connect: { id: userId } }
            }
        });
        contacts.push(c);
    }
    console.log(`✅ Created ${contacts.length} Contacts`);

    // 4. Create Leads
    for (let i = 0; i < 10; i++) {
        await prisma.lead.create({
            data: {
                tenant: { connect: { id: tenantId } },
                email: `lead${i + 1}@test.com`,
                name: `Lead Candidate ${i + 1}`,
                status: i % 2 === 0 ? 'NEW' : 'CONTACTED',
                source: 'WEBSITE',
                createdBy: { connect: { id: userId } }
            }
        });
    }
    console.log('✅ Created 10 Leads');

    // 5. Create Deals
    const stages = ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED'];
    for (let i = 0; i < 8; i++) {
        await prisma.deal.create({
            data: {
                tenant: { connect: { id: tenantId } },
                title: `Deal with ${companies[i % companies.length].name}`,
                value: (i + 1) * 5000,
                stage: stages[i % stages.length] as any,
                status: i % stages.length === 4 ? 'WON' : 'OPEN', // Set status based on stage
                company: { connect: { id: companies[i % companies.length].id } },
                createdBy: { connect: { id: userId } }
            }
        });
    }
    console.log('✅ Created 8 Deals');

    // 6. Support Tickets
    await prisma.ticket.create({
        data: {
            tenant: { connect: { id: tenantId } },
            title: 'Login Issue',
            description: 'User cannot login with valid credentials',
            priority: 'HIGH',
            status: 'OPEN',
            createdBy: { connect: { id: userId } },
            assignedTo: { connect: { id: userId } }
        }
    });
    await prisma.ticket.create({
        data: {
            tenant: { connect: { id: tenantId } },
            title: 'Feature Request: Dark Mode',
            priority: 'LOW',
            status: 'OPEN',
            createdBy: { connect: { id: userId } }
        }
    });
    console.log('✅ Created 2 Tickets');

    // 7. Automation - Inbound
    await prisma.inboundEndpoint.create({
        data: {
            tenant: { connect: { id: tenantId } },
            name: 'Website Contact Form',
            endpointKey: 'web-contact',
            mappingConfig: {},
            isActive: true
        }
    });
    console.log('✅ Created Inbound Endpoint');

    // 8. Automation - Outbound
    await prisma.outboundWebhookSubscription.create({
        data: {
            tenant: { connect: { id: tenantId } },
            name: 'Slack Notification',
            url: 'https://hooks.slack.com/services/T000/B000/XXXX',
            eventTypes: ['lead.created', 'deal.won'],
            enabled: true
        }
    });
    console.log('✅ Created Outbound Subscription');

    console.log('🚀 Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
