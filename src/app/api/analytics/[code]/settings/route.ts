import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Url from '@/models/Url';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { userId, orgId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const ownerId = orgId || userId;

        await dbConnect();
        const { code } = await params;
        const body = await request.json();

        // Ensure we only update allowed fields
        const updates: any = {};
        if (body.webhookUrl !== undefined) updates.webhookUrl = body.webhookUrl;
        if (body.gaMeasurementId !== undefined) updates.gaMeasurementId = body.gaMeasurementId;
        if (body.gaApiSecret !== undefined) updates.gaApiSecret = body.gaApiSecret;

        const updatedUrl = await Url.findOneAndUpdate(
            { shortCode: code, ownerId },
            { $set: updates },
            { new: true }
        ).lean();

        if (!updatedUrl) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json(updatedUrl, { status: 200 });

    } catch (error) {
        console.error('Settings Update Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
