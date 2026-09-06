import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Url from '@/models/Url';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        await dbConnect();
        const { code } = await params;
        const body = await request.json();

        // Ensure we only update allowed fields
        const updates: any = {};
        if (body.webhookUrl !== undefined) updates.webhookUrl = body.webhookUrl;
        if (body.gaMeasurementId !== undefined) updates.gaMeasurementId = body.gaMeasurementId;
        if (body.gaApiSecret !== undefined) updates.gaApiSecret = body.gaApiSecret;

        const updatedUrl = await Url.findOneAndUpdate(
            { shortCode: code },
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
