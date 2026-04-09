import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { t } from "@/lib/i18n-extract";
import { Info } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { Wallet } from "@/generated/prisma";

interface StatsCardProps {
    wallet: Wallet & {
        _count: {
            transactions: number;
        };
    };
}

const StatsCard = ({ wallet, monthlyIncome, monthlyExpense }: StatsCardProps & { monthlyIncome: number; monthlyExpense: number }) => {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Info className="h-4 w-4" /> {t("wallet.quickSummary", "Quick Summary")}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm">{t("wallet.totalMovements", "Total Movements")}</span>
                    <span className="font-medium">{wallet._count.transactions}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                    <span className="text-sm text-emerald-600 font-medium">{t("wallet.monthlyIncome", "Monthly Income")}</span>
                    <span className="font-medium text-emerald-600">${monthlyIncome.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-destructive font-medium">{t("wallet.monthlyExpenses", "Monthly Expenses")}</span>
                    <span className="font-medium text-destructive">-${monthlyExpense.toFixed(2)}</span>
                </div>
            </CardContent>
        </Card>
    )
}

export default StatsCard