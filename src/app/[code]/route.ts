import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Url from '@/models/Url';
import { redis } from '@/lib/redis';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        // In Next.js 15+, params is a Promise in Route Handlers
        const { code } = await params;

        // 1. Check Redis Cache First (Read-Through Cache)
        if (process.env.UPSTASH_REDIS_REST_URL) {
            try {
                const cachedUrl = await redis.get<string>(code);
                
                if (cachedUrl) {
                    // Cache HIT: We found the destination URL instantly!
                    
                    // Asynchronously update MongoDB without blocking the redirect
                    dbConnect().then(() => {
                        Url.updateOne({ shortCode: code }, { $inc: { clicks: 1 } }).exec()
                           .catch(err => console.error('Failed to increment async click:', err));
                    });

                    return NextResponse.redirect(cachedUrl, 302);
                }
            } catch (redisError) {
                console.error('Redis cache error:', redisError);
                // Fallback to MongoDB if Redis fails
            }
        }

        // 2. Cache MISS: Query MongoDB
        await dbConnect();
        const urlDoc = await Url.findOneAndUpdate(
            { shortCode: code },
            { $inc: { clicks: 1 } }
        ).select('originalUrl').lean();

        if (urlDoc && urlDoc.originalUrl) {
            // Write to cache for next time
            if (process.env.UPSTASH_REDIS_REST_URL) {
                redis.set(code, urlDoc.originalUrl).catch(err => console.error('Failed to cache:', err));
            }
            return NextResponse.redirect(urlDoc.originalUrl, 302);
        }

        // If no matching URL is found, redirect to the home page or a 404 page.
        const notFoundUrl = new URL('/?error=not-found', request.url);
        return NextResponse.redirect(notFoundUrl, 302);

    } catch (error) {
        console.error('Redirect Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
