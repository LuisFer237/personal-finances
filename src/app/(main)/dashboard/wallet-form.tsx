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
            toast.error("Name is required");
            setLoading(false);
            return;
        }

        if (!trimmedType) {
            toast.error("Type is required");
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
                throw new Error(data.error || "Failed to process request");
            }

            toast.success(isEditing ? "Wallet updated!" : "Wallet created!");

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
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: My Savings"
                        required
                    />
                </Field>
                <Field>
                    <Label htmlFor="type">Type</Label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger id="type">
                            <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="bank">Bank</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
            </FieldGroup>

            <div className="flex justify-end gap-3">
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Saving..." : isEditing ? "Update Wallet" : "Create Wallet"}
                </Button>
            </div>
        </form>
    );
}