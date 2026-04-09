"use client";
import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDownCircle, ArrowUpCircle, History, Tag } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { format } from 'date-fns';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pen, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/animate-ui/components/radix/dialog';
import TransactionForm from './transaction-form';
import { t } from "@/lib/i18n-extract";
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export interface TransactionWithCategory {
    id: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    description: string | null;
    categoryId: string;
    date: Date;
    category: {
        name: string;
    }
}

interface TransactionHistoryProps {
    transactions: TransactionWithCategory[];
    walletId: string;
    categories: { id: string; name: string; description: string | null }[];
    initialData?: TransactionWithCategory | null;
}

const TransactionHistory = ({ transactions, walletId, categories, initialData }: TransactionHistoryProps) => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithCategory | null>(null);
    const router = useRouter();

    const handleOpenEdit = (tx: TransactionWithCategory) => {
        setSelectedTransaction(tx);
        setIsEditDialogOpen(true);
    }

    const handleOpenDelete = (tx: TransactionWithCategory) => {
        setSelectedTransaction(tx);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedTransaction) return;

        const loadingToast = toast.loading(t("wallet.transaction.deleting", "Deleting transaction..."));

        try {
            const response = await fetch(`/api/transactions/${selectedTransaction.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || t("wallet.transaction.deleteFailed", "Failed to delete transaction"));
            }

            toast.success(t("wallet.transaction.deleteSuccess", "Transaction deleted successfully"), { id: loadingToast });
            setIsDeleteDialogOpen(false);
            router.refresh();

        } catch (error: any) {
            toast.error(error.message, { id: loadingToast });
        }
    };

    return (
        <>
            <Card className="overflow-hidden border-none shadow-sm bg-card/50 p-0">
                <CardContent className="p-0">
                    {transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-12">
                            <div className="rounded-full bg-muted p-3 mb-4">
                                <History className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">{t("wallet.transaction.emptyTitle", "No transactions yet")}</h3>
                            <p className="text-sm text-muted-foreground">{t("wallet.transaction.emptyDescription", "Your recent movements will appear here.")}</p>
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
                                                onClick={() => handleOpenEdit(tx)}
                                            >
                                                <Pen className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 bg-background shadow-sm hover:text-destructive transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleOpenDelete(tx);
                                                }}
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
                                                    <DropdownMenuItem
                                                        className="gap-2"
                                                        onClick={() => handleOpenEdit(tx)}
                                                    >
                                                        <Pen className="h-4 w-4" /> {t("common.edit", "Edit")}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="gap-2 text-destructive focus:text-destructive"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenDelete(tx);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" /> {t("common.delete", "Delete")}
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

            {/* DIALOG ÚNICO: Fuera del loop */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t("wallet.transaction.edit", "Edit Transaction")}</DialogTitle>
                    </DialogHeader>

                    <TransactionForm
                        key={selectedTransaction?.id || "new"}
                        walletId={walletId}
                        categories={categories}
                        initialData={selectedTransaction}
                        onSuccess={() => setIsEditDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* DIALOG DE ELIMINACIÓN */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-destructive flex items-center gap-2">
                            <Trash2 className="h-5 w-5" /> {t("wallet.transaction.deleteTitle", "Delete Transaction")}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        <p className="text-sm text-muted-foreground mb-4">
                            {t("wallet.transaction.deleteQuestion", "Are you sure you want to delete this transaction?")}
                        </p>

                        {/* Tarjeta de resumen de lo que se va a borrar */}
                        {selectedTransaction && (
                            <div className="bg-muted/50 p-3 rounded-md border border-border/50 mb-4 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-sm">{selectedTransaction.description || selectedTransaction.category.name}</p>
                                    <p className="text-xs text-muted-foreground">{format(selectedTransaction.date, "MMM d, yyyy")}</p>
                                </div>
                                <p className={`font-bold text-sm ${selectedTransaction.type === "INCOME" ? "text-emerald-600" : "text-foreground"}`}>
                                    {selectedTransaction.type === "INCOME" ? "+" : "-"}
                                    {selectedTransaction.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                                </p>
                            </div>
                        )}

                        <p className="text-xs text-muted-foreground">
                            {t("wallet.transaction.deleteWarning", "This action cannot be undone. Your wallet balance will be updated automatically.")}
                        </p>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            {t("common.cancel", "Cancel")}
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            {t("common.delete", "Delete")}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default TransactionHistory