/**
 * Simple test script to verify Prisma database connection
 * Run with: npx tsx scripts/test-db.ts
 */

import { prisma } from '../lib/prisma'

async function main() {
    try {
        console.log('🔍 Testing database connection...\n')

        // Test 1: Check database connection
        await prisma.$connect()
        console.log('✅ Database connection successful')

        // Test 2: Create a test user
        const user = await prisma.user.create({
            data: {
                email: 'test@example.com',
                name: 'Test User',
            },
        })
        console.log('✅ Created test user:', user.email)

        // Test 3: Create an organization with the user as owner
        const org = await prisma.organization.create({
            data: {
                name: 'Test Organization',
                slug: 'test-org',
                createdById: user.id,
                members: {
                    create: {
                        userId: user.id,
                        role: 'OWNER',
                    },
                },
                subscription: {
                    create: {
                        plan: 'FREE',
                        status: 'ACTIVE',
                    },
                },
            },
            include: {
                members: true,
                subscription: true,
            },
        })
        console.log('✅ Created organization:', org.name)
        console.log('   - Members:', org.members.length)
        console.log('   - Subscription:', org.subscription?.plan)

        // Test 4: Query with relations
        const orgWithData = await prisma.organization.findUnique({
            where: { slug: 'test-org' },
            include: {
                members: {
                    include: {
                        user: true,
                    },
                },
                subscription: true,
            },
        })
        console.log('✅ Query with relations successful')
        console.log('   - Owner:', orgWithData?.members[0]?.user.name)

        // Cleanup
        await prisma.organization.delete({ where: { id: org.id } })
        await prisma.user.delete({ where: { id: user.id } })
        console.log('\n✨ All tests passed! Database is working correctly.')

    } catch (error) {
        console.error('❌ Error:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
