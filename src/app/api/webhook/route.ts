import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    interface WebhookRequest{
        id: string,
        type: string,
        date: string,
        subject: object;
    }

    try {
        
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
        return NextResponse.json({ error: `Failed to process webhook: ${error}` }, { status: 500 });
    }
}
