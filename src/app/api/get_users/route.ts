import { NextResponse } from "next/server";
import clerkClient from "@clerk/clerk-sdk-node";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    try {
        const user = await clerkClient.users.getUser(userId);
        return NextResponse.json({
            username: user.username || user.firstName || "Anonymous",
            profileImageUrl: user.imageUrl,
        });
    } catch (error) {
        return NextResponse.json({ error: "User not found" }, { status: 500 });
    }
}
