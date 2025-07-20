import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    interface WebhookRequest {
        id: string;
        type: string;
        date: string;
        subject: {
            transaction_id: string;
            status: { id: number; description: string; };
            payment_sequence: string;
            created_at: string;
            price: {
                amount: number;
                currency: string;
                base_currency: string;
                base_currency_price: number;
            };
            price_paid: {
                amount: number;
                currency: string;
                base_currency: string;
                base_currency_price: number;
            };
            payment_method: { name: string; refundable: boolean; };
            fees: { tax: object; gateway: object; };
            customer: {
                first_name: string;
                last_name: string;
                email: string;
                ip: string;
                username: object;
                marketing_consent: boolean;
                country: string;
                postal_code: string | null;
            };
            products: object[];
            coupons: any[];
            gift_cards: any[];
            recurring_payment_reference: string | null;
            custom: object;
            revenue_share: any[];
            decline_reason: string | null;
            creator_code: string | null;
        }
    }


try {

    // Verify the signature
    const reqBody: WebhookRequest = await req.json()
    const { id, type, subject } = reqBody
    if (!id || !type) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    if (type === 'payment.completed') {
        paymentSuccess(id);
        console.log(subject.products)
    }

    return NextResponse.json({
        id: id
    }, { status: 200 });
} catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: `Failed to process webhook: ${error}` }, { status: 500 });
}

function paymentSuccess(id: string) {


    // Handle payment success logic here
    // fetch(`${process.env.API_BASE_URL}/api/sendCommand`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         command: 'paymentSuccess',
    //         data: { id }
    //     })
    // })
    console.log(`Payment successful for ID: ${id}`);
}}

