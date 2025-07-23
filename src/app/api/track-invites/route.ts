import { NextResponse } from "next/server";
import Invite from "@/models/invite.js";
import { connect } from "@/dbconfig/dbConfig";

connect();

// interface joinedUser {
//     username: string;
//     userId: string;
//     joinedAt: Date;
// }

// IMP: We are not manipulating the uses here, instead we are using joinedUser.length to determine the number of uses.

export async function POST(req: Request) {

    try {
        const data = await req.json();
        const { inviter, code, uses, joinedUser } = data;

        const existing = await Invite.findOne({ "inviter.id": inviter.id, code });

        if (existing) {
            const alreadyJoined = existing.joinedUsers.some((u: { userId: string }) => u.userId === joinedUser.id);

            if (!alreadyJoined) {
                //existing.uses +=1
                existing.invites +=1;
                existing.uses = uses;
                existing.joinedUsers.push({
                    userId: joinedUser.id,
                    username: joinedUser.username,
                    joinedAt: joinedUser.joinedAt
                });
                await existing.save();
            }
        } else {
            await Invite.create({
                inviter,
                code,
                uses,
                invites: 1, // :1 start with 1 use for the first user,
                joinedUsers: [
                    {
                        userId: joinedUser.id,
                        username: joinedUser.username,
                        joinedAt: joinedUser.joinedAt
                    }
                ]
            });
        }


        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error saving invite data:", error);
        return NextResponse.json({ success: false, error: "Failed to save invite data" }, { status: 500 });
    }
}
