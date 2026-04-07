import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ajusta el path a tu instancia de Prisma
import { getServerSession } from "@/lib/get-session"; // Ajusta a tu auth

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        // 1. Esperamos a que los params resuelvan para obtener el ID
        const { id } = await params;

        // 2. Obtenemos los datos del cuerpo de la petición
        const { name, type } = await req.json();

        if (name !== undefined && (typeof name !== "string" || !name.trim())) {
            return NextResponse.json({ error: "Name must be a non-empty string" }, { status: 400 });
        }

        if (type !== undefined && (typeof type !== "string" || !type.trim())) {
            return NextResponse.json({ error: "Type must be a non-empty string" }, { status: 400 });
        }

        // 3. Actualizamos en la base de datos
        const updatedWallet = await prisma.wallet.update({
            where: {
                id: id,
                userId: session.user.id // Por seguridad, verificamos que sea del usuario
            },
            data: {
                ...(name !== undefined && { name: name.trim() }),
                ...(type !== undefined && { type: type.trim() }),
            },
        });

        return NextResponse.json(updatedWallet);
    } catch (error) {
        console.error("Error en PATCH wallet:", error);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;

        await prisma.wallet.delete({
            where: {
                id: id,
                userId: session.user.id
            },
        });

        return NextResponse.json({ message: "Wallet deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Error deleting wallet" }, { status: 500 });
    }
}