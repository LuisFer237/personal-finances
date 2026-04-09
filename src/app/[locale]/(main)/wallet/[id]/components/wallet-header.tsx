import React from 'react'
import Link from 'next/link'
import { ChevronLeft, Pen } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { t } from "@/lib/i18n-extract";
import { Wallet } from "@/generated/prisma";

interface WalletHeaderProps {
    wallet: Wallet;
}

const WalletHeader = ({ wallet }: WalletHeaderProps) => {
    return (
        <div className="flex flex-col space-y-3">
            {/* 1. El enlace de volver siempre se queda arriba */}
            <Link
                href="/dashboard"
                className="group flex w-fit items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
                <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                {t("wallet.backToDashboard", "Back to Dashboard")}
            </Link>

            {/* 2. El Título, Badge y Botón comparten siempre la misma fila */}
            <div className="flex flex-row flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-semibold tracking-tight">{wallet.name}</h1>
                    <Badge variant="outline" className="capitalize px-2 py-0">
                        {wallet.type === 'cash' ? t("wallet.cashWithIcon", "💵 Cash") : t("wallet.bankWithIcon", "🏦 Bank")}
                    </Badge>
                </div>

                {/* shrink-0 evita que el botón se aplaste si el título es muy largo */}
                <div className="flex items-center shrink-0">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Pen className="h-4 w-4" />
                        {t("common.edit", "Edit")}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default WalletHeader