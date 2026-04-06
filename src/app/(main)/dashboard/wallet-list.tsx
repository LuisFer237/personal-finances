"use client"
import React from 'react'
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import { BsCash } from "react-icons/bs";
import { FaRegCreditCard } from "react-icons/fa";
import Link from 'next/link';

interface Wallet{
    id: string;
    name: string;
    balance: number;
    type: string;
    createdAt: string;
    updatedAt: string;
}

const WalletList = () => {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadWallets() {
            setLoading(true);
            try {
                const res = await fetch("/api/wallets");
                if (!res.ok) throw new Error("Failed to fetch wallets");
                const data = await res.json();
                setWallets(data);
            }catch (error) {
                setError(error instanceof Error ? error.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        }
        loadWallets();
    }, []);

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
            </div>
        );
    }

    if (error) return <p className="text-red-500">{error}</p>;

    if (wallets.length === 0) {
        return <p className="text-muted-foreground text-sm italic">No tienes carteras creadas aún.</p>;
    }

    return (
        <div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {wallets.map((wallet) => (
            // Envolvemos la Card con el Link
            <Link key={wallet.id} href={`/wallet/${wallet.id}`}>
                <Card className="hover:border-primary transition-all hover:shadow-md cursor-pointer group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    {wallet.name}
                    </CardTitle>
                    <span className="text-muted-foreground group-hover:text-primary transition-colors">
                    {wallet.type === "cash" ? (
                        <BsCash size={20} />
                    ) : wallet.type === "bank" ? (
                        <FaRegCreditCard size={20} />
                    ) : (
                        "None"
                    )}
                    </span>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                    ${wallet.balance.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                    Saldo disponible • <span className="capitalize">{wallet.type}</span>
                    </p>
                </CardContent>
                </Card>
            </Link>
            ))}
        </div>
        </div>
    );
}

export default WalletList