"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/animate-ui/components/radix/dialog"
import {
    Field,
    FieldGroup,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { t } from "@/lib/i18n-extract";
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface WalletFormProps {
    initialData?: { id: string; name: string; type: string };
    onSuccess: () => void;
}

export default function WalletForm({ initialData, onSuccess }: WalletFormProps) {
    const [name, setName] = useState(initialData?.name || "");
    const [type, setType] = useState(initialData?.type || "");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const isEditing = !!initialData;

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const trimmedName = name.trim();
        const trimmedType = type.trim();

        if (!trimmedName) {
            toast.error(t("wallet.validation.nameRequired", "Name is required"));
            setLoading(false);
            return;
        }

        if (!trimmedType) {
            toast.error(t("wallet.validation.typeRequired", "Type is required"));
            setLoading(false);
            return;
        }

        try {
            const url = isEditing ? `/api/wallets/${initialData.id}` : "/api/wallets";
            const method = isEditing ? "PATCH" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: trimmedName, type: trimmedType }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || t("wallet.validation.failedRequest", "Failed to process request"));
            }

            toast.success(isEditing ? t("wallet.updated", "Wallet updated!") : t("wallet.created", "Wallet created!"));

            router.refresh();
            onSuccess();

        } catch (error) {
            console.error("WalletForm error:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <FieldGroup>
                <Field>
                    <Label htmlFor="name">{t("common.name", "Name")}</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t("wallet.namePlaceholder", "Ej: My Savings")}
                        required
                    />
                </Field>
                <Field>
                    <Label htmlFor="type">{t("common.type", "Type")}</Label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger id="type">
                            <SelectValue placeholder={t("wallet.selectType", "Select a type")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="cash">{t("wallet.cash", "Cash")}</SelectItem>
                                <SelectItem value="bank">{t("wallet.bank", "Bank")}</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
            </FieldGroup>

            <div className="flex justify-end gap-3">
                <Button type="submit" disabled={loading} className="w-full">
                    {loading
                        ? t("common.saving", "Saving...")
                        : isEditing
                            ? t("wallet.update", "Update Wallet")
                            : t("wallet.create", "Create Wallet")}
                </Button>
            </div>
        </form>
    );
}