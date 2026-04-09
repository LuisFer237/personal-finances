import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { amount, type, categoryId, description, date } = await request.json();

    if (!id || !amount || !type || !categoryId || !date) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            const oldTransaction = await tx.transaction.findUnique({
                where: { id },
                select: { amount: true, type: true, walletId: true }
            });

            if (!oldTransaction) {
                throw new Error("Transaction not found");
            }

            // Convertimos a Number por seguridad matemática
            const oldImpact = oldTransaction.type === "INCOME" ? -Number(oldTransaction.amount) : Number(oldTransaction.amount);
            const newImpact = type === "INCOME" ? Number(amount) : -Number(amount);

            await tx.wallet.update({
                where: { id: oldTransaction.walletId },
                data: { balance: { increment: oldImpact + newImpact } }
            });

            return await tx.transaction.update({
                where: { id },
                data: {
                    amount: Number(amount),
                    type,
                    categoryId,
                    description,
                    date: new Date(date),
                }
            });
        });

        return NextResponse.json(result);

    } catch (error) {
        console.error("PATCH Error:", error);
        return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
    }
}


export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            const oldTransaction = await tx.transaction.findUnique({
                where: { id },
                select: { amount: true, type: true, walletId: true }
            });

            if (!oldTransaction) {
                throw new Error("Transaction not found");
            }

            const oldImpact = oldTransaction.type === "INCOME" ? -Number(oldTransaction.amount) : Number(oldTransaction.amount);

            await tx.wallet.update({
                where: { id: oldTransaction.walletId },
                data: { balance: { increment: oldImpact } }
            });

            return await tx.transaction.delete({
                where: { id }
            });
        });

        return NextResponse.json(result);

    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
    }
}