import { NextResponse } from "next/server";
import { getServerSession } from "../../../lib/get-session";
import prisma from "../../../lib/prisma";

export async function GET(req: Request) {
    const session = await getServerSession();
    if (!session?.user?.id){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wallets = await prisma.wallet.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    })

    console.log("Fetched wallets for user", session.user.id, wallets);

    return NextResponse.json(wallets);
}

export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session?.user?.id){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, type } = await req.json();

    console.log("Creating wallet with name:", name, "and type:", type, "for user:", session.user.id);

    if (!name || typeof name !== "string") {
        return NextResponse.json({ error: "Name is required and must be a string" }, { status: 400 });
    }

    const wallet = await prisma.wallet.create({
        data: {
            name,
            userId: session.user.id,
            type: type || "other",
            balance: 0,
        },
    });

    return NextResponse.json(wallet);
}