import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import ClickAnalytics from '@/models/ClickAnalytics';
import Url from '@/models/Url';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        await dbConnect();
        const { code } = await params;

        // Verify URL exists
        const urlDoc = await Url.findOne({ shortCode: code }).lean();
        if (!urlDoc) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        // Run aggregations in parallel for better performance
        const [referrers, devices, browsers, clicksOverTime] = await Promise.all([
            // Top Referrers
            ClickAnalytics.aggregate([
                { $match: { shortCode: code } },
                { $group: { _id: '$referrer', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),
            // Device breakdown
            ClickAnalytics.aggregate([
                { $match: { shortCode: code } },
                { $group: { _id: '$device', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            // Browser breakdown
            ClickAnalytics.aggregate([
                { $match: { shortCode: code } },
                { $group: { _id: '$browser', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            // Clicks over time (grouped by day)
            ClickAnalytics.aggregate([
                { $match: { shortCode: code } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }, // Oldest to newest
                { $limit: 30 } // Last 30 active days
            ])
        ]);

        return NextResponse.json({
            url: urlDoc,
            analytics: {
                totalClicks: urlDoc.clicks,
                referrers: referrers.map(r => ({ name: r._id, count: r.count })),
                devices: devices.map(d => ({ name: d._id, count: d.count })),
                browsers: browsers.map(b => ({ name: b._id, count: b.count })),
                timeline: clicksOverTime.map(t => ({ date: t._id, count: t.count }))
            }
        });

    } catch (error) {
        console.error('Analytics aggregation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
