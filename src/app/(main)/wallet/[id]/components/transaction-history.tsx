import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDownCircle, ArrowUpCircle, History, Tag } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Wallet } from "@/generated/prisma";
import { Transaction } from '@/generated/prisma';
import { format } from 'date-fns';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pen, Trash2 } from "lucide-react";

interface TransactionWithCategory {
    id: string;
    amount: number;
    type: string;
    description: string | null;
    date: Date;
    category: {
        name: string;
    }
}

const TransactionHistory = ({ transactions }: { transactions: TransactionWithCategory[] }) => {
    return (
        <Card className="overflow-hidden border-none shadow-sm bg-card/50 p-0">
            <CardContent className="p-0">
                {transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-12">
                        <div className="rounded-full bg-muted p-3 mb-4">
                            <History className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No transactions yet</h3>
                        <p className="text-sm text-muted-foreground">Your recent movements will appear here.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/50">
                        {transactions.map((tx) => (
                            <div
                                key={tx.id}
                                className="relative flex items-center p-4 hover:bg-muted/50 transition-all duration-300 group overflow-hidden"
                            >
                                {/* Lado Izquierdo e Info (El translate solo aplica en desktop 'md:') */}
                                <div className="flex items-center gap-4 flex-1 min-w-0 transition-transform duration-300 md:group-hover:-translate-x-2">
                                    <div className={`flex items-center justify-center h-10 w-10 rounded-full shrink-0 ${tx.type === "INCOME" ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"
                                        }`}>
                                        {tx.type === "INCOME" ? <ArrowUpCircle className="h-5 w-5" /> : <ArrowDownCircle className="h-5 w-5" />}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-sm truncate uppercase">
                                            {tx.description || tx.category.name}
                                        </p>
                                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Tag className="h-3 w-3" /> {tx.category.name}
                                            </span>
                                            <span>•</span>
                                            <span>{format(tx.date, "MMM d, yyyy")}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contenedor Derecho (Monto + Acciones) */}
                                <div className="flex items-center gap-2 ml-4">
                                    {/* Monto: En desktop se mueve, en móvil se queda fijo */}
                                    <div className="text-right transition-transform duration-300 md:group-hover:-translate-x-24">
                                        {/* Cambié -translate-x-12 por -translate-x-24 
                                            para dejarle espacio a los DOS botones (~80px + gap) 
                                        */}
                                        <p className={`font-bold text-sm ${tx.type === "INCOME" ? "text-emerald-600" : "text-foreground"}`}>
                                            {tx.type === "INCOME" ? "+" : "-"}
                                            {tx.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                                            {tx.type}
                                        </p>
                                    </div>

                                    {/* Contenedor de acciones WEB: Ajustado para dos botones */}
                                    <div className="hidden md:flex absolute right-[-100px] items-center gap-2 group-hover:right-4 transition-all duration-300 opacity-0 group-hover:opacity-100">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 bg-background shadow-sm hover:text-emerald-600 transition-colors"
                                        >
                                            <Pen className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 bg-background shadow-sm hover:text-destructive transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* ACCIONES MÓVIL: Siempre visible en móvil, oculto en desktop (md:hidden) */}
                                    <div className="md:hidden">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40">
                                                <DropdownMenuItem className="gap-2">
                                                    <Pen className="h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                                                    <Trash2 className="h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default TransactionHistory