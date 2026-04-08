import { NextResponse } from "next/server";
import { getServerSession } from "../../../lib/get-session";
import prisma from "../../../lib/prisma";

export async function GET(request: Request) {
    const session = await getServerSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get("walletId");
    if (!walletId) {
        return NextResponse.json({ error: "Missing walletId parameter" }, { status: 400 });
    }

    try {
        const transactions = await prisma.transaction.findMany({
            where: { walletId },
            include: { category: true },
        });
        return NextResponse.json(transactions);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, type, categoryId, description, date, walletId } = await request.json();

    if (!amount || !type || !categoryId || !date || !walletId) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {

        const result = await prisma.$transaction(async (tx) => {
            const transaction = await prisma.transaction.create({
                data: {
                    amount,
                    type,
                    categoryId,
                    description,
                    date: new Date(date),
                    walletId,
                    userId: session.user.id,
                }
            });

            const balanceChange = type === "INCOME" ? Number(amount) : -Number(amount);
            await prisma.wallet.update({
                where: { id: walletId, userId: session.user.id },
                data: { balance: { increment: balanceChange } }
            });

            return transaction;
        });


        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Transaction Error:", error);
        return NextResponse.json(
            { error: "Failed to process transaction and update balance" },
            { status: 500 }
        );
    }

}