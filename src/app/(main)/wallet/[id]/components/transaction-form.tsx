"use client";

import React from 'react';
import { z } from 'zod';
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from 'react';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import CategoryForm from './category-form';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// 1. Definimos el esquema. 
// Usamos .or(z.string()) para que acepte lo que viene del input antes de la coerción
const TransactionFormSchema = z.object({
    amount: z.union([z.number(), z.string()])
        .transform((val) => Number(val))
        .refine((val) => val > 0, { message: "The amount must be positive" }),
    type: z.enum(["INCOME", "EXPENSE"]),
    categoryId: z.string().min(1, "Required"),
    description: z.string().optional().or(z.literal("")),
    date: z.string(),
});

type TransactionFormInput = z.input<typeof TransactionFormSchema>;
type TransactionFormData = z.output<typeof TransactionFormSchema>;

interface TransactionFormProps {
    walletId: string;
    categories: { id: string; name: string; description: string | null }[];
    onSuccess?: () => void;
    initialType?: "INCOME" | "EXPENSE";
}

const TransactionForm = ({
    walletId,
    categories,
    onSuccess,
    initialType = "EXPENSE"
}: TransactionFormProps) => {
    const [localCategories, setLocalCategories] = useState(categories);
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const router = useRouter();

    // Input y output separados para soportar transformaciones de Zod (amount)
    const form = useForm<TransactionFormInput, any, TransactionFormData>({
        resolver: zodResolver(TransactionFormSchema),
        defaultValues: {
            amount: 0,
            type: initialType,
            description: "",
            categoryId: "",
            date: new Date().toISOString(),
        },
    });

    const selectedType = form.watch("type");
    const displayCategories = localCategories;

    const onSubmit: SubmitHandler<TransactionFormData> = async (data) => {
        try {
            const response = await fetch("/api/transactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, walletId }),
            });

            if (!response.ok) throw new Error("Failed to create transaction");

            toast.success("Transaction recorded!");
            form.reset();
            router.refresh();
            if (onSuccess) onSuccess();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                {/* Selector de Tipo */}
                <div className="flex p-1 bg-muted rounded-md w-full">
                    <Button
                        type="button"
                        variant={selectedType === "EXPENSE" ? "default" : "ghost"}
                        className="flex-1 h-8 text-xs"
                        onClick={() => form.setValue("type", "EXPENSE")}
                    >
                        Expense
                    </Button>
                    <Button
                        type="button"
                        variant={selectedType === "INCOME" ? "default" : "ghost"}
                        className="flex-1 h-8 text-xs"
                        onClick={() => form.setValue("type", "INCOME")}
                    >
                        Income
                    </Button>
                </div>

                {/* Monto */}
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Categoría */}
                <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <FormLabel>Category</FormLabel>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs gap-1 text-white hover:bg-emerald-50 transition duration-300"
                                    onClick={() => setIsCategoryDialogOpen(true)}
                                >
                                    <Plus className="h-3 w-3" />
                                    New Category
                                </Button>
                            </div>

                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {displayCategories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                    <DialogContent className="sm:max-w-[350px]">
                        <DialogHeader>
                            <DialogTitle>Create Category</DialogTitle>
                        </DialogHeader>
                        <CategoryForm
                            onSuccess={(newCat) => {
                                setLocalCategories(prev => [...prev, newCat]);
                                form.setValue("categoryId", newCat.id);
                                setIsCategoryDialogOpen(false);
                            }}
                        />
                    </DialogContent>
                </Dialog>

                {/* Descripción */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="What was this for?" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Saving..." : "Save Transaction"}
                </Button>
            </form>
        </Form>
    );
};

export default TransactionForm;