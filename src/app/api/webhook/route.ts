import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    


try {

    // Verify the signature
    const reqBody = await req.json()
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

