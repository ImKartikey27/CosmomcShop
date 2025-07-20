import { connect } from "@/dbconfig/dbConfig";
import Invite from "@/models/Invite";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    connect();
    console.log("Received POST request to /api/track-invites/deduct-uses");

    Invite.updateMany(
        { uses: { $gt: 0 } }, // Find all invites with uses greater
        { $inc: { uses: -1 } } // Decrement uses by 1
        ).then((result) => {
            console.log("Uses decremented successfully:", result);
        }).catch((error) => {
            console.error("Error decrementing uses:", error);
        }
    );

    const reqBody = await request.json();
    console.log("Request body:", reqBody);

    return NextResponse.json({ message: "Invite tracked successfully" }, { status: 200 });
}