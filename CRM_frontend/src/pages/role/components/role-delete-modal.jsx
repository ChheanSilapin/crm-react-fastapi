import { AlertTriangle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useRoleDelete } from "@/hooks/mutations/useRole";
import { ConfirmDialog } from "@/components/confirm-dailog";

export function RoleDeleteModal({ open, onOpenChange, role }) {
  const [value, setValue] = useState("");
  const { mutate, isPending } = useRoleDelete();

  // Reset input when modal opens/closes
  useEffect(() => {
    if (!open) setValue("");
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value !== role?.name) return;

    mutate(role.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form="role-delete-form"
      isLoading={isPending}
      disabled={value !== role?.name}
      className="sm:max-w-lg"
      title={
        <span className="flex items-center text-destructive">
          <AlertTriangle
            className="me-2 inline-block stroke-destructive"
            size={18}
          />
          Delete Role
        </span>
      }
      desc={
        <form
          id="role-delete-form"
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          <p className="mb-2">
            Are you sure you want to delete{" "}
            <span className="font-bold">{role?.name}</span>?
            <br />
            This action will permanently remove the role from the system. This
            cannot be undone.
          </p>

          <div className="space-y-2 my-4">
            <Label>
              Type <span className="font-bold">{role?.name}</span> to confirm:
            </Label>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter role name to confirm deletion"
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
