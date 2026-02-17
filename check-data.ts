import { prisma } from './lib/prisma';

async function main() {
    const companyCount = await prisma.company.count();
    const contactCount = await prisma.contact.count();
    const leadCount = await prisma.lead.count();
    const dealCount = await prisma.deal.count();
    const ticketCount = await prisma.ticket.count();

    console.log(`Companies: ${companyCount}`);
    console.log(`Contacts: ${contactCount}`);
    console.log(`Leads: ${leadCount}`);
    console.log(`Deals: ${dealCount}`);
    console.log(`Tickets: ${ticketCount}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
