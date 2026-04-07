"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SlOptionsVertical } from "react-icons/sl";
import { LuPencil, LuTrash } from "react-icons/lu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import WalletForm from "./wallet-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Definimos la interfaz para recibir los datos de la wallet desde el listado
interface WalletOptionsProps {
  wallet: {
    id: string;
    name: string;
    type: string;
  };
}

export function WalletOptionsButton({ wallet }: WalletOptionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/wallets/${wallet.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to delete wallet");
        return;
      }

      toast.success("Wallet deleted!");
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while deleting the wallet");
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }

  };


  return (
    // 1. Envolvemos todo en un div que bloquea el paso al Link
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            // 2. Detenemos tanto el comportamiento por defecto como la propagación
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <SlOptionsVertical size={16} className="text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          // 3. Importante: Evitamos que el clic en el contenido del menú 
          // (que a veces se renderiza fuera del portal en dev) afecte al Link
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setIsMenuOpen(false);
                setIsEditOpen(true);
              }}
            >
              <LuPencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive"
              onSelect={(e) => {
                e.preventDefault();
                setIsMenuOpen(false);
                setIsDeleteOpen(true);
              }}
            >
              <LuTrash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent
          className="sm:max-w-sm"
          // Bloqueamos clics accidentales en el modal que lleguen al fondo
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Edit Wallet</DialogTitle>
          </DialogHeader>

          <WalletForm
            initialData={wallet}
            onSuccess={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              wallet <strong>{wallet.name}</strong> and all associated data.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes, delete wallet"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div >
  );
}