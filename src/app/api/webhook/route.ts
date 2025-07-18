import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    interface WebhookRequest{
        id: string,
        type: string,
        date: string,
        subject: Object;
    }

    try {
        const reqBody: WebhookRequest = await req.json()
        const { id, type } = reqBody
        if (type == "validation.webhook") {
            return NextResponse.json({
                id: id
            }, { status: 200 });

        }
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

        // (Optional) Parse JSON if needed after verifying
        const jsonBody = JSON.parse(rawBuffer.toString());
        console.log('Received JSON:', jsonBody);

        // Return response
        return NextResponse.json({ message: 'Webhook received', hash: finalHash });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
    }
}
