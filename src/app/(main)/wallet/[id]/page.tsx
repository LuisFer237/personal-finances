import React from 'react'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowUpCircle, ArrowDownCircle, Wallet as WalletIcon, History, Info, Settings } from 'lucide-react'
import Link from 'next/link'

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
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header con Migas de Pan / Botón Volver */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Volver al Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{wallet.name}</h1>
            <Badge variant="secondary" className="capitalize">
              {wallet.type === 'cash' ? '💵 Efectivo' : '🏦 Banco'}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2">
            <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
            </Button>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card de Saldo Principal */}
        <Card className="md:col-span-2 overflow-hidden border-primary/20 shadow-lg">
          <CardHeader className="bg-primary/5 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <WalletIcon className="h-4 w-4" />
              Saldo Disponible Total
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-5xl font-mono font-bold tracking-tighter">
              ${wallet.balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              <span className="text-xl text-muted-foreground ml-2">MXN</span>
            </div>
            
            <div className="flex gap-4 mt-8">
                <Button className="flex-1 gap-2 bg-green-600 hover:bg-green-700">
                    <ArrowUpCircle className="h-4 w-4" /> Ingreso
                </Button>
                <Button className="flex-1 gap-2" variant="destructive">
                    <ArrowDownCircle className="h-4 w-4" /> Gasto
                </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card de Estadísticas Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Info className="h-4 w-4" /> Resumen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Movimientos</span>
                <span className="font-semibold">{wallet._count.transactions}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-green-600">
                <span className="text-sm">Ingresos (Mes)</span>
                <span className="font-semibold">+$0.00</span>
            </div>
            <div className="flex justify-between items-center text-red-600">
                <span className="text-sm">Gastos (Mes)</span>
                <span className="font-semibold">-$0.00</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Contenido Inferior */}
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" /> Historial
          </TabsTrigger>
          <TabsTrigger value="details">Detalles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="mt-6 border rounded-lg p-8 text-center bg-muted/20">
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Aquí aparecerán tus transacciones recientes.</p>
                <Button variant="link">Registrar mi primer movimiento</Button>
            </div>
        </TabsContent>

        <TabsContent value="details" className="mt-6 border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-lg">Información técnica</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-muted-foreground">Creada el</p>
                    <p>{wallet.createdAt.toLocaleDateString()}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">ID único</p>
                    <p className="font-mono text-[10px] break-all">{wallet.id}</p>
                </div>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}