"use client";
import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpCircle, ArrowDownCircle, Wallet as WalletIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Wallet } from "@/generated/prisma";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/animate-ui/components/radix/dialog"
import TransactionForm from './transaction-form';
import { MdOutlineContactless } from "react-icons/md";
import { getServerSession } from "@/lib/get-session";

interface BalanceCardProps {
    wallet: Wallet;
    categories: { id: string; name: string; description: string | null }[];
    lastTransactionDate: Date;
    userName: string;
}

const BalanceCard = ({ wallet, categories, lastTransactionDate, userName }: BalanceCardProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [transactionType, setTransactionType] = useState<'INCOME' | 'EXPENSE'>('INCOME');

    const handleOpenDialog = (type: 'INCOME' | 'EXPENSE') => {
        setTransactionType(type);
        setIsDialogOpen(true);
    }

    const isBank = wallet.type === 'bank';

    return (
        <>
            <Card className={`lg:col-span-2 shadow-2xl h-full flex flex-col transition-all duration-500 overflow-hidden relative border-none rounded-2xl mx-auto w-full
                ${isBank
                    ? "bg-slate-50 dark:bg-[#111111] text-slate-950 dark:text-white font-sans sm:aspect-[1.586/1] max-w-[500px] lg:max-w-none lg:h-[330px] border border-slate-200 dark:border-none"
                    : "bg-card/50 aspect-auto"
                }`}>

                {isBank && (
                    <>
                        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.15] bg-blue-500 blur-3xl -right-10 -top-10 h-40 w-40 rounded-full" />

                        {/* Fila Superior: Ajustamos el top en móvil */}
                        <div className="absolute top-4 sm:top-5 left-6 right-6 flex justify-between items-center z-20">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-200">
                                <WalletIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span className="font-bold text-[10px] uppercase tracking-widest truncate max-w-[100px]">{wallet.name}</span>
                            </div>
                            <span className="text-[10px] font-bold tracking-wide text-slate-400 dark:text-slate-500 uppercase">Premium</span>
                        </div>

                        {/* Icono Contactless: Lo ocultamos en móviles muy pequeños para limpiar espacio */}
                        <MdOutlineContactless className="hidden sm:block absolute top-16 right-6 h-5 w-5 text-slate-400 dark:text-slate-500 opacity-40 z-20" />

                        {/* Chip Dorado: Más pequeño en móvil */}
                        <div className="absolute top-12 sm:top-14 left-6 z-20 scale-75 sm:scale-100 origin-left">
                            <div className="w-10 h-7 bg-gradient-to-br from-[#f5e3a3] via-[#e2c173] to-[#d4af37] rounded-md shadow-sm border border-amber-200/50 dark:border-black/10">
                                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20 dark:opacity-30">
                                    <div className="border-r border-b border-black"></div>
                                    <div className="border-r border-b border-black"></div>
                                    <div className="border-b border-black"></div>
                                    <div className="border-r border-black"></div>
                                    <div className="border-r border-black"></div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Padding dinámico: más arriba en móviles si es banco para no chocar con el chip */}
                <CardContent className={`relative z-10 flex-1 flex flex-col ${isBank ? "justify-end px-6 pb-0 pt-24 sm:pt-6" : "justify-center p-6"}`}>

                    <div className={`${isBank ? "space-y-4" : "flex flex-col gap-6 sm:flex-row sm:items-end justify-between"}`}>

                        <div className={isBank ? "w-full" : ""}>
                            {!isBank && (
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                                    <WalletIcon className="h-4 w-4" />
                                    Current Balance
                                </div>
                            )}

                            {/* Balance: Ajustamos el tamaño de texto para que sea fluido */}
                            <div className={`font-bold tracking-tight ${isBank
                                ? "text-2xl min-[400px]:text-3xl sm:text-4xl font-mono text-slate-900 dark:text-slate-100 tracking-[0.02em] mb-4 flex items-baseline gap-1"
                                : "text-4xl sm:text-5xl"
                                }`}>
                                <span className={isBank ? "opacity-40 text-xl" : ""}>$</span>
                                {wallet.balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                <span className={`font-normal ml-2 ${isBank ? "text-xs sm:text-sm text-slate-500 dark:text-slate-400" : "text-lg text-muted-foreground"}`}>MXN</span>
                            </div>

                            {isBank && (
                                <div className="flex justify-between items-end w-full gap-2">
                                    <div className="space-y-0.5 min-w-0">
                                        <p className="text-[8px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-bold">Card Holder</p>
                                        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-slate-200 truncate">
                                            {userName || "Guest User"}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 sm:gap-3 items-center shrink-0">
                                        <div className="text-right leading-none">
                                            <p className="text-[7px] uppercase text-slate-400 dark:text-slate-500 font-bold">Valid Thru</p>
                                        </div>
                                        <p className="text-[10px] sm:text-xs font-mono text-slate-700 dark:text-slate-200">{format(new Date(), "MM/yy")}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Botones: En móviles muy pequeños los ponemos uno al lado del otro si caben o flex-col */}
                        <div className={`flex flex-wrap gap-2 w-full sm:w-auto ${isBank ? "pt-4 border-t border-slate-200 dark:border-white/5" : ""}`}>
                            <Button
                                onClick={() => handleOpenDialog("INCOME")}
                                size="sm"
                                className={`flex-1 sm:flex-none gap-2 h-8 sm:h-9 shadow-sm ${isBank
                                    ? "bg-emerald-600 dark:bg-emerald-500 dark:text-slate-950 text-white hover:bg-emerald-700 dark:hover:bg-emerald-400 font-bold text-[11px] sm:text-xs"
                                    : "bg-emerald-600 hover:bg-emerald-700"
                                    }`}
                            >
                                <ArrowUpCircle className="h-4 w-4" /> Income
                            </Button>
                            <Button
                                onClick={() => handleOpenDialog("EXPENSE")}
                                size="sm"
                                className={`flex-1 sm:flex-none gap-2 h-8 sm:h-9 text-[11px] sm:text-xs`}
                                variant={isBank ? "outline" : "destructive"}
                            >
                                <ArrowDownCircle className="h-4 w-4" /> Expense
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            Register Transaction
                        </DialogTitle>
                    </DialogHeader>

                    <TransactionForm
                        walletId={wallet.id}
                        categories={categories}
                        initialType={transactionType}
                        onSuccess={() => setIsDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default BalanceCard