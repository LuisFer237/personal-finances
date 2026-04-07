import React from 'react'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet as WalletIcon,
  History,
  Info,
  Settings,
  ChevronLeft
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { UserIcon, CalendarDaysIcon, ShieldIcon } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function WalletView({ params }: PageProps) {
  const { id } = await params;

  const wallet = await prisma.wallet.findUnique({
    where: { id: id },
    include: {
      _count: {
        select: { transactions: true }
      }
    }
  });

  if (!wallet) return notFound();

  return (
    // Aplicamos los mismos márgenes y ancho máximo que en el Dashboard (max-w-6xl)
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="space-y-6">

        {/* Header - Siguiendo el estilo del Dashboard */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{wallet.name}</h1>
              <Badge variant="outline" className="capitalize px-2 py-0">
                {wallet.type === 'cash' ? '💵 Cash' : '🏦 Bank'}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Grid Principal - 2/3 para el saldo y 1/3 para el resumen */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Card de Saldo Principal - Estilo similar a ProfileInformation */}
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
                    Last updated: {format(wallet.updatedAt, "MMMM d, yyyy")}
                  </p>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <Button className="flex-1 sm:flex-none gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <ArrowUpCircle className="h-4 w-4" /> Income
                  </Button>
                  <Button className="flex-1 sm:flex-none gap-2" variant="destructive">
                    <ArrowDownCircle className="h-4 w-4" /> Expense
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de Resumen Rápido */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Info className="h-4 w-4" /> Quick Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Movements</span>
                <span className="font-medium">{wallet._count.transactions}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-emerald-600 font-medium">Monthly Income</span>
                <span className="font-medium text-emerald-600">+$0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-destructive font-medium">Monthly Expenses</span>
                <span className="font-medium text-destructive">-$0.00</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Contenido - Estilo Dashboard */}
        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="history" className="gap-2 px-6">
              <History className="h-4 w-4" /> History
            </TabsTrigger>
            <TabsTrigger value="details" className="gap-2 px-6">
              <UserIcon className="h-4 w-4" /> Technical Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <History className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No transactions yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Your recent movements will appear here.</p>
                <Button variant="outline" size="sm">Register first movement</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Metadata</CardTitle>
                <CardDescription>Technical information about this wallet</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <CalendarDaysIcon className="size-4" /> Created on
                  </p>
                  <p className="font-medium">{format(wallet.createdAt, "MMMM d, yyyy")}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <ShieldIcon className="size-4" /> Unique Identifier
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
    </main>
  );
}