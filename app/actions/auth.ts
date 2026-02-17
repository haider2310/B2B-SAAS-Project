'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function registerUser(formData: FormData) {
    const name = formData.get('name') as string;
    const companyName = formData.get('companyName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !companyName || !email || !password) {
        return { error: 'All fields are required' };
    }

    try {
        // 1. Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: { email }
        });

        if (existingUser) {
            return { error: 'User with this email already exists' };
        }

        // 2. Create Tenant (Slugify company name)
        const slug = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).substring(7);

        const tenant = await prisma.tenant.create({
            data: {
                name: companyName,
                slug: slug,
                domain: slug + '.snapcut.ai' // Placeholder domain
            }
        });

        // 3. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create User (Owner)
        await prisma.user.create({
            data: {
                tenantId: tenant.id,
                name,
                email,
                password: hashedPassword,
                role: 'OWNER',
                image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
            }
        });

        return { success: true };

    } catch (error) {
        console.error('Registration error:', error);
        return { error: 'Something went wrong. Please try again.' };
    }
}
