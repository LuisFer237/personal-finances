import React from 'react'
import prisma from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { History, UserIcon, CalendarDaysIcon, ShieldIcon } from 'lucide-react'
import { format, startOfMonth } from 'date-fns'
import { getServerSession } from "@/lib/get-session"
import { t } from "@/lib/i18n-extract";
import TransactionHistory, { TransactionWithCategory } from './components/transaction-history'
import WalletHeader from './components/wallet-header'
import BalanceCard from './components/balance-card'
import StatsCards from './components/stats-card'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function WalletView({ params }: PageProps) {
  const now = new Date();
  const firstDayOfMonth = startOfMonth(now);
  const { id } = await params;

  const session = await getServerSession();
  if (!session?.user?.id) {
    redirect("/login"); // Es más limpio redirigir que lanzar un error
  }

  const [wallet, categories, stats, lastTransaction, transactions] = await Promise.all([
    prisma.wallet.findUnique({
      where: { id },
      include: { _count: { select: { transactions: true } } }
    }),
    prisma.category.findMany({
      where: { userId: session.user.id }
    }),
    prisma.transaction.groupBy({
      by: ['type'],
      where: {
        walletId: id,
        userId: session.user.id,
        date: {
          gte: firstDayOfMonth
        }
      },
      _sum: {
        amount: true
      },

    }),
    prisma.transaction.findFirst({
      where: { walletId: id },
      orderBy: { date: 'desc' },
      select: { date: true }
    }),
    prisma.transaction.findMany({
      where: { walletId: id },
      orderBy: { date: 'desc' },
      take: 50,
      include: {
        category: true
      }
    })
  ]);

  if (!wallet || wallet.userId !== session.user.id) {
    return notFound();
  }

  const monthlyIncome = stats.find(s => s.type === "INCOME")?._sum.amount || 0;
  const monthlyExpense = stats.find(s => s.type === "EXPENSE")?._sum.amount || 0;
  const lastTransactionDate = lastTransaction?.date || wallet.updatedAt;


  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8" >
      <div className="space-y-6">

        <WalletHeader wallet={wallet} />

        <div className="grid gap-6 lg:grid-cols-3 items-stretch">
          <BalanceCard wallet={wallet} categories={categories} lastTransactionDate={lastTransactionDate} userName={session.user.name} />

          {/* Ahora pasamos los montos reales calculados */}
          <StatsCards
            wallet={wallet}

            monthlyIncome={monthlyIncome}
            monthlyExpense={monthlyExpense}
          />
        </div>

        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="history" className="gap-2 px-6">
              <History className="h-4 w-4" /> {t("wallet.history", "History")}
            </TabsTrigger>
            <TabsTrigger value="details" className="gap-2 px-6">
              <UserIcon className="h-4 w-4" /> {t("wallet.technicalDetails", "Technical Details")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <TransactionHistory
              transactions={transactions as unknown as TransactionWithCategory[]}
              walletId={wallet.id}
              categories={categories}
            />
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("wallet.metadata", "Metadata")}</CardTitle>
                <CardDescription>{t("wallet.metadataDescription", "Technical information about this wallet")}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <CalendarDaysIcon className="size-4" /> {t("wallet.createdOn", "Created on")}
                  </p>
                  <p className="font-medium">{format(wallet.createdAt, "MMMM d, yyyy")}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <ShieldIcon className="size-4" /> {t("wallet.uniqueIdentifier", "Unique Identifier")}
                  </p>
                  <p className="font-mono text-xs bg-muted p-2 rounded-md break-all">
                    {wallet.id}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main >
  );
}