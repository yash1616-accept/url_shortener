import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import ClickAnalytics from '@/models/ClickAnalytics';
import Url from '@/models/Url';
import { auth } from '@clerk/nextjs/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { userId, orgId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const ownerId = orgId || userId;

        await dbConnect();
        const { code } = await params;

        // Verify URL exists and belongs to user
        const urlDoc = await Url.findOne({ shortCode: code, ownerId }).lean();
        if (!urlDoc) {
            return new NextResponse('Not found', { status: 404 });
        }

        // Fetch all raw clicks for this shortCode
        const clicks = await ClickAnalytics.find({ shortCode: code })
            .sort({ timestamp: -1 })
            .lean();

        // Convert to CSV
        const header = 'Timestamp,Country,City,Referrer,Browser,Device\n';
        const rows = clicks.map(c => {
            // Escape quotes and wrap in quotes for safety
            const safe = (str: any) => `"${String(str || '').replace(/"/g, '""')}"`;
            return [
                safe(new Date(c.timestamp).toISOString()),
                safe(c.country),
                safe(c.city),
                safe(c.referrer),
                safe(c.browser),
                safe(c.device)
            ].join(',');
        });

        const csvContent = header + rows.join('\n');

        // Return as downloadable file
        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="analytics_${code}.csv"`,
            }
        });

    } catch (error) {
        console.error('CSV Export Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
