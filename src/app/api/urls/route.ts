import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Url from '@/models/Url';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
    try {
        const { userId, orgId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const ownerId = orgId || userId;

        await dbConnect(); // Uses the cached connection

        // Fetch the latest 10 URLs sorted by creation date for this specific owner
        const recentUrls = await Url.find({ ownerId })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean(); // Use lean for faster plain JS objects

        return NextResponse.json(recentUrls, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching URLs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
