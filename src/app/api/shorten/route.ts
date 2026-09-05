import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Url from '@/models/Url';
import { isValidUrl, generateUniqueShortCode } from '@/lib/utils';
import { redis } from '@/lib/redis';

export async function POST(request: Request) {
    try {
        await dbConnect(); // Uses the cached connection!

        const body = await request.json();
        const originalUrl = body.originalUrl?.trim();

        // 1. Validation
        if (!originalUrl) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        if (!isValidUrl(originalUrl)) {
            return NextResponse.json(
                { error: 'Invalid URL format. Please ensure it starts with http:// or https://' }, 
                { status: 400 }
            );
        }

        // Optional: Check if we've already shortened this exact URL to save space
        const existingUrl = await Url.findOne({ originalUrl });
        if (existingUrl) {
            return NextResponse.json(existingUrl, { status: 200 });
        }

        // 2. Code Generation with Collision Handling (length 6)
        const shortCode = await generateUniqueShortCode(Url, 6);

        // 3. Save to MongoDB
        const newUrl = await Url.create({
            originalUrl,
            shortCode
        });

        // 4. Cache in Upstash Redis (write-through cache)
        if (process.env.UPSTASH_REDIS_REST_URL) {
            try {
                // Cache the destination URL with the shortCode as the key
                await redis.set(shortCode, originalUrl);
            } catch (redisError) {
                console.error('Redis caching error:', redisError);
                // Don't fail the request if just caching fails
            }
        }

        return NextResponse.json(newUrl, { status: 201 });
    } catch (error: any) {
        console.error('Error in /api/shorten:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}