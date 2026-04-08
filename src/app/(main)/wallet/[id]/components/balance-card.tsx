"use client";
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpCircle, ArrowDownCircle, Wallet as WalletIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Wallet } from "@/generated/prisma";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import TransactionForm from './transaction-form';

interface BalanceCardProps {
    wallet: Wallet;
    categories: { id: string; name: string; description: string | null }[];
    lastTransactionDate: Date;
}

const BalanceCard = ({ wallet, categories, lastTransactionDate }: BalanceCardProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // 1. Cambia el tipo aquí a MAYÚSCULAS para coincidir con el Form y Prisma
    const [transactionType, setTransactionType] = useState<'INCOME' | 'EXPENSE'>('INCOME');

    // 2. Actualiza la función manejadora
    const handleOpenDialog = (type: 'INCOME' | 'EXPENSE') => {
        setTransactionType(type);
        setIsDialogOpen(true);
    }

    return (
        <>
            <Card className="lg:col-span-2 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <WalletIcon className="h-4 w-4" />
                        Current Balance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-end justify-between">
                        <div>
                            <div className="text-4xl sm:text-5xl font-bold tracking-tight">
                                ${wallet.balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                <span className="text-lg font-normal text-muted-foreground ml-2">MXN</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                {/* Usamos la fecha real de la última transacción */}
                                Last activity: {format(new Date(lastTransactionDate), "MMMM d, yyyy")}
                            </p>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            <Button
                                onClick={() => handleOpenDialog("INCOME")}
                                className="flex-1 sm:flex-none gap-2 bg-emerald-600 hover:bg-emerald-700"
                            >
                                <ArrowUpCircle className="h-4 w-4" /> Income
                            </Button>
                            <Button
                                onClick={() => handleOpenDialog("EXPENSE")}
                                className="flex-1 sm:flex-none gap-2"
                                variant="destructive"
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