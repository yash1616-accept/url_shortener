import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Url from '@/models/Url';

export async function GET() {
    try {
        await dbConnect(); // Uses the cached connection

        // Fetch the latest 10 URLs sorted by creation date
        const recentUrls = await Url.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .lean(); // Use lean for faster plain JS objects

        return NextResponse.json(recentUrls, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching URLs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
