import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session"; // Usa tu ruta correcta
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    const session = await getServerSession();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description } = await request.json();

    if (!name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    try {
        const category = await prisma.category.create({
            data: {
                name,
                description: description || null,
                userId,
            }
        });
        return NextResponse.json(category);
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}

export async function GET() {
    const session = await getServerSession();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const categories = await prisma.category.findMany({
            where: { userId }
        });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}