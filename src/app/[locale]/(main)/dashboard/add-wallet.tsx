"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/animate-ui/components/radix/dialog";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n-extract";
import WalletForm from "./wallet-form"; // Asegúrate de que la ruta sea correcta

export default function AddWallet() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {/* Este botón es el que el usuario ve en el dashboard */}
                <Button variant="outline">{t("wallet.create", "Create Wallet")}</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{t("wallet.create", "Create Wallet")}</DialogTitle>
                    <DialogDescription>
                        {t("wallet.createDescription", "Fill in the details below to add a new account or wallet.")}
                    </DialogDescription>
                </DialogHeader>

                {/* Le pasamos onSuccess para que cuando el formulario termine 
          de guardar exitosamente, el modal se cierre solo.
        */}
                <WalletForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}