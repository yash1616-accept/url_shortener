import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';

export async function GET() {
    try {
        await dbConnect();
        return NextResponse.json({ message: 'MongoDB connection successful!' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to connect to MongoDB', details: error.message }, { status: 500 });
    }
}
