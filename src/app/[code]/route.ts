import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Url from '@/models/Url';
import ClickAnalytics from '@/models/ClickAnalytics';
import { redis } from '@/lib/redis';
import { UAParser } from 'ua-parser-js';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;

        // Extract analytics data from headers
        const userAgentString = request.headers.get('user-agent') || '';
        const parser = new UAParser(userAgentString);
        const browser = parser.getBrowser().name || 'Unknown';
        const deviceType = parser.getDevice().type || 'Desktop';
        
        const referrer = request.headers.get('referer') || 'Direct';
        const country = request.headers.get('x-vercel-ip-country') || 'Unknown';
        const city = request.headers.get('x-vercel-ip-city') || 'Unknown';

        // Helper to run background tasks without blocking redirect
        const logAnalytics = async () => {
            try {
                await dbConnect();
                
                // Fire and forget updates, getting the doc back for webhook/GA
                const updatedUrl = await Url.findOneAndUpdate(
                    { shortCode: code },
                    { $inc: { clicks: 1 } },
                    { new: true }
                ).lean();

                if (!updatedUrl) return;

                await ClickAnalytics.create({
                    shortCode: code,
                    country,
                    city,
                    referrer,
                    browser,
                    device: deviceType,
                });

                // 1. Fire Webhook
                if (updatedUrl.webhookUrl) {
                    fetch(updatedUrl.webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            shortCode: code,
                            originalUrl: updatedUrl.originalUrl,
                            clicks: updatedUrl.clicks,
                            country,
                            city,
                            referrer,
                            browser,
                            device: deviceType,
                            timestamp: new Date().toISOString()
                        })
                    }).catch(err => console.error('Webhook Error:', err));
                }

                // 2. Fire Google Analytics
                if (updatedUrl.gaMeasurementId && updatedUrl.gaApiSecret) {
                    const clientId = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
                    fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${updatedUrl.gaMeasurementId}&api_secret=${updatedUrl.gaApiSecret}`, {
                        method: 'POST',
                        body: JSON.stringify({
                            client_id: clientId,
                            events: [{
                                name: 'short_link_click',
                                params: {
                                    short_code: code,
                                    country: country,
                                    device: deviceType,
                                    browser: browser,
                                    referrer: referrer
                                }
                            }]
                        })
                    }).catch(err => console.error('GA Error:', err));
                }

            } catch (err) {
                console.error('Failed to log analytics:', err);
            }
        };

        // 1. Check Redis Cache First
        if (process.env.UPSTASH_REDIS_REST_URL) {
            try {
                const cachedUrl = await redis.get<string>(code);
                
                if (cachedUrl) {
                    // Start analytics logging in background
                    logAnalytics();
                    return NextResponse.redirect(cachedUrl, 302);
                }
            } catch (redisError) {
                console.error('Redis cache error:', redisError);
            }
        }

        // 2. Cache MISS: Query MongoDB
        await dbConnect();
        const urlDoc = await Url.findOne({ shortCode: code }).select('originalUrl').lean();

        if (urlDoc && urlDoc.originalUrl) {
            // Write to cache for next time
            if (process.env.UPSTASH_REDIS_REST_URL) {
                redis.set(code, urlDoc.originalUrl).catch(err => console.error('Failed to cache:', err));
            }
            
            // Log analytics for the cache miss
            logAnalytics();
            return NextResponse.redirect(urlDoc.originalUrl, 302);
        }

        const notFoundUrl = new URL('/?error=not-found', request.url);
        return NextResponse.redirect(notFoundUrl, 302);

    } catch (error) {
        console.error('Redirect Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
