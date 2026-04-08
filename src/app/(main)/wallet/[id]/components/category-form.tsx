"use client";

import React from 'react';
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const CategoryFormSchema = z.object({
    name: z.string().min(1, "Name is required").max(30, "Too long"),
    description: z.string().max(100, "Maximum 100 characters").optional().or(z.literal("")),
})

type CategoryFormData = z.infer<typeof CategoryFormSchema>;

interface CategoryFormProps {
    onSuccess?: (category: any) => void;
}

const CategoryForm = ({ onSuccess }: CategoryFormProps) => {
    const form = useForm<CategoryFormData>({
        resolver: zodResolver(CategoryFormSchema),
        defaultValues: {
            name: "",
            description: "",
        }
    });

    const onSubmit = async (data: CategoryFormData) => {
        try {
            const response = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data), // Enviamos solo name y description
            });

            if (!response.ok) throw new Error("Failed to create category");

            const newCategory = await response.json();
            toast.success(`Category "${newCategory.name}" added`);
            form.reset();
            if (onSuccess) onSuccess(newCategory);

        } catch (error) {
            toast.error("Failed to create category");
        }
    }

    return (
        <Form {...form}>
            <form className="space-y-6">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium">Category Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Rent, Food, Salary..." {...field} autoFocus />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium">Description (Optional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Add more details about this category..."
                                        className="resize-none h-20"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <Button
                        type="button" // IMPORTANTE: type button, no submit
                        disabled={form.formState.isSubmitting}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation(); // Evita que el evento llegue al form padre
                            form.handleSubmit(onSubmit)();
                        }}
                    >
                        {form.formState.isSubmitting ? "Creating..." : "Save Category"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default CategoryForm;