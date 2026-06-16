import { AlertTriangle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useDeleteBankMutation } from "@/hooks/mutations/useBank";
import { ConfirmDialog } from "@/components/confirm-dailog";

export function BankDeleteDialog({ open, onOpenChange, bank }) {
  const [value, setValue] = useState("");
  const { mutate, isPending } = useDeleteBankMutation();

  // Reset input when modal opens/closes
  useEffect(() => {
    if (!open) setValue("");
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value !== bank?.bank_name) return;

    mutate(bank.bank_id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form="bank-delete-form"
      isLoading={isPending}
      disabled={value !== bank?.bank_name}
      className="sm:max-w-lg"
      title={
        <span className="flex items-center text-destructive">
          <AlertTriangle
            className="me-2 inline-block stroke-destructive"
            size={18}
          />
          Delete Bank
        </span>
      }
      desc={
        <form
          id="bank-delete-form"
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          <p className="mb-2">
            Are you sure you want to delete{" "}
            <span className="font-bold">{bank?.bank_name}</span>?
            <br />
            This action will permanently remove the bank from the system. This
            cannot be undone.
          </p>

          <div className="space-y-2 my-4">
            <Label>
              Type <span className="font-bold">{bank?.bank_name}</span> to
              confirm:
            </Label>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter bank name to confirm deletion"
              autoFocus
              disabled={isPending}
            />
          </div>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation cannot be rolled back.
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={
        isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Deleting...
          </>
        ) : (
          "Delete"
        )
      }
      destructive
    />
  );
}
