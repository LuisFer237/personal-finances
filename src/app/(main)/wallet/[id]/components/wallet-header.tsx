import React from 'react'
import Link from 'next/link'
import { ChevronLeft, Settings } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface WalletHeaderProps {
    wallet: {
        name: string;
        type: string;
    }
}

const WalletHeader = ({ wallet }: WalletHeaderProps) => {
    return (
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
    )
}

export default WalletHeader