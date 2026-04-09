"use client";
import React from 'react'
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import { BsCash } from "react-icons/bs";
import { FaRegCreditCard } from "react-icons/fa";
import Link from 'next/link';
import { WalletOptionsButton } from './wallet-options-button';
import { motion, AnimatePresence } from "framer-motion";
import { t } from "@/lib/i18n-extract";

interface Wallet {
    id: string;
    name: string;
    balance: number;
    type: string;
    createdAt: Date;
    updatedAt: Date;
}

interface WalletListProps {
    wallets: Wallet[];
    display?: "grid" | "list" | null;
}

const WalletList = ({ wallets, display }: WalletListProps) => {

    if (wallets.length === 0) {
        return (
            <Card>
                <CardContent className='text-center py-10'>
                    <CardTitle className='mb-2'>{t("wallet.emptyTitle", "No wallets found")}</CardTitle>
                    <p className='text-sm text-muted-foreground'>{t("wallet.emptyDescription", "Start by creating your first wallet to manage your finances.")}</p>
                </CardContent>
            </Card>
        );
    }

    const isList = display === "list";

    const containerClass = isList
        ? "flex flex-col gap-2"
        : "grid gap-4 md:grid-cols-2 lg:grid-cols-3";

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={display}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className={containerClass}
            >
                {wallets.map((wallet) => (
                    <Link key={wallet.id} href={`/wallet/${wallet.id}`}>
                        <Card className={`hover:border-primary transition-all hover:shadow-md cursor-pointer group ${isList ? "py-3 px-4" : ""}`}>

                            <div className={isList ? "flex items-center w-full gap-4" : ""}>

                                {/* BLOQUE ICONO: shrink-0 para que no se aplaste */}
                                {isList && (
                                    <div className="p-2 bg-muted rounded-full text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                                        {wallet.type === "cash" ? <BsCash size={16} /> : <FaRegCreditCard size={16} />}
                                    </div>
                                )}

                                {/* BLOQUE TEXTO: flex-grow para que tome todo el espacio del medio */}
                                <div className={isList ? "flex-grow min-w-0" : ""}>
                                    <CardHeader className={`${isList ? "p-0 space-y-0" : "flex flex-row items-center justify-between space-y-0 pb-2"}`}>
                                        <CardTitle className={`${isList ? "text-base" : "text-md"} font-medium truncate`}>
                                            {wallet.name}
                                        </CardTitle>

                                        {!isList && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground group-hover:text-primary transition-colors">
                                                    {wallet.type === "cash" ? <BsCash size={20} /> : <FaRegCreditCard size={20} />}
                                                </span>
                                                <WalletOptionsButton wallet={wallet} />
                                            </div>
                                        )}
                                    </CardHeader>

                                    {isList && (
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">
                                            {wallet.type}
                                        </p>
                                    )}
                                </div>

                                {/* BLOQUE DERECHO: Balance y Opciones */}
                                <CardContent className={`${isList ? "p-0 flex items-center gap-4 shrink-0" : ""}`}>
                                    <div className={isList ? "text-right" : "flex flex-col justify-between"}>
                                        <div className={`${isList ? "text-lg" : "text-2xl"} font-bold whitespace-nowrap`}>
                                            ${wallet.balance.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                        </div>

                                        {!isList && (
                                            <p className="text-xs text-muted-foreground">
                                                {t("wallet.availableBalance", "Available balance")} • <span className="capitalize">{wallet.type}</span>
                                            </p>
                                        )}
                                    </div>

                                    {isList && (
                                        <div onClick={(e) => e.preventDefault()} className="shrink-0">
                                            <WalletOptionsButton wallet={wallet} />
                                        </div>
                                    )}
                                </CardContent>
                            </div>
                        </Card>
                    </Link>
                ))}
            </motion.div>
        </AnimatePresence>
    );
}

export default WalletList;