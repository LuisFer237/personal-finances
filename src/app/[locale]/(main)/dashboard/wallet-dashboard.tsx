import React from 'react'
import WalletList from './wallet-list'
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { unauthorized } from "next/navigation";
import AddWallet from './add-wallet';
import { t } from "@/lib/i18n-extract";
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BsGrid3X2Gap } from "react-icons/bs";
import { MdOutlineFormatListBulleted } from "react-icons/md";


const WalletDashboard = async ({
    searchParams
}: {
    searchParams: Promise<{ view?: string }>
}) => {
    const session = await getServerSession();
    const user = session?.user;

    if (!user) unauthorized();

    const { view } = await searchParams;
    const currentView = (view === "list" ? "list" : "grid") as "grid" | "list";

    const wallets = await prisma.wallet.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <div className='flex justify-between items-center mb-5'>
                <h2 className="text-xl font-semibold mb-4">{t("wallet.overview", "Wallet Overview")}</h2>
                <div className='flex justify-center items-center gap-3'>
                    <Tabs value={currentView}>
                        <TabsList>
                            <TabsTrigger value="grid" asChild>
                                <Link
                                    href="?view=grid"
                                >
                                    <BsGrid3X2Gap />
                                </Link>
                            </TabsTrigger>
                            <TabsTrigger value="list" asChild>
                                <Link
                                    href="?view=list"
                                >
                                    <MdOutlineFormatListBulleted />
                                </Link>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>


                    <AddWallet />
                </div>
            </div>

            <WalletList wallets={wallets} display={currentView} />
        </div>
    )
}

export default WalletDashboard