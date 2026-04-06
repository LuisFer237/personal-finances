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
} from "@/components/ui/dialog"
import {
  Field,
  FieldGroup,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddWallet() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); // Ahora sí se ejecutará
        console.log("Submitting form with name:", name);
        
        const trimmed = name.trim();
        if (!trimmed) return alert("Name is required");

        const validTypes = ["cash", "bank"];
        if (type && !validTypes.includes(type)) {
            return alert("Invalid type selected");
        }

        try {
            setLoading(true);
            const res = await fetch("/api/wallets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: trimmed, type }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create wallet");
            }

            setName("");
            setType("");
            setOpen(false);
            router.refresh();
        } catch (error) {
            alert("An error occurred while creating the wallet");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">Create Wallet</Button>
                </DialogTrigger>
                
                {/* El formulario debe envolver solo el contenido interno */}
                <DialogContent className="sm:max-w-sm">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Create Wallet</DialogTitle>
                            <DialogDescription>
                                Fill in the details for your new wallet.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4"> {/* Espaciado simple */}
                            <FieldGroup>
                                <Field>
                                    <Label htmlFor="name-1">Name</Label>
                                    <Input 
                                        id="name-1" 
                                        name="name" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)} 
                                        required 
                                    />
                                </Field>
                                <Field className="mt-[-10]">
                                    <Label htmlFor="type-1">Type</Label>
                                    <Select value={type} onValueChange={setType}>
                                        <SelectTrigger className="">
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
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Saving..." : "Save changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}