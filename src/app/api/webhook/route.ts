import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    interface WebhookRequest{
        id: string,
        type: string,
        date: string,
        subject: object;
    }

    try {

        const secret = process.env.TOKEN_SECRET as string;

        // Read raw body buffer
        const rawBody = await req.arrayBuffer();
        const rawBuffer = Buffer.from(rawBody);

        // Generate hash
        const bodyHash = crypto
            .createHash('sha256')
            .update(rawBuffer.toString(), 'utf-8')
            .digest('hex');

        const finalHash = crypto
            .createHmac('sha256', secret)
            .update(bodyHash)
            .digest('hex');

        console.log('finalHash', finalHash);
        
        // Verify the signature
        const reqBody: WebhookRequest = await req.json()
        const { id, type } = reqBody
        if (type == "validation.webhook") {
            return NextResponse.json({
                id: id
            }, { status: 200 });

        }
                
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
    }
}
