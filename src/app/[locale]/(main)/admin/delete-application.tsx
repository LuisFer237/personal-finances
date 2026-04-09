"use client";

import { LoadingButton } from "@/components/loading-button";
import { t } from "@/lib/i18n-extract";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteApplication } from "./actions";

export function DeleteApplication() {
  const [isPending, startTransition] = useTransition();

  async function handleDeleteApplication() {
    startTransition(async () => {
      try {
        await deleteApplication();
        toast.success(t("admin.delete.success", "Application deletion authorized successfully"));
      } catch (error) {
        console.error(error);
        toast.error(t("common.somethingWentWrong", "Something went wrong"));
      }
    });
  }

  return (
    <div className="max-w-md">
      <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-4">
        <div className="space-y-3">
          <div>
            <h2 className="text-destructive font-medium">{t("admin.delete.title", "Delete Application")}</h2>
            <p className="text-muted-foreground text-sm">
              {t("admin.delete.description", "This action will delete the entire application. This cannot be undone.")}
            </p>
          </div>
          <LoadingButton
            loading={isPending}
            onClick={handleDeleteApplication}
            variant="destructive"
            className="w-full"
          >
            {t("admin.delete.button", "Delete Application")}
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
