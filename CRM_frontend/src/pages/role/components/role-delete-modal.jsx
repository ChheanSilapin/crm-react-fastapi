import { AlertTriangle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useUserDelete } from "@/hooks/mutations/useUser";
import { ConfirmDialog } from "@/components/confirm-dailog";

export function UserDeleteModal({ open, onOpenChange, user }) {
  const [value, setValue] = useState("");
  const { mutate, isPending } = useUserDelete();

  // Reset input when modal opens/closes
  useEffect(() => {
    if (!open) setValue("");
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value !== user?.username) return;

    mutate(user.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form="user-delete-form"
      isLoading={isPending}
      disabled={value !== user?.username}
      className="sm:max-w-lg"
      title={
        <span className="flex items-center text-destructive">
          <AlertTriangle
            className="me-2 inline-block stroke-destructive"
            size={18}
          />
          Delete User
        </span>
      }
      desc={
        <form
          id="user-delete-form"
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          <p className="mb-2">
            Are you sure you want to delete{" "}
            <span className="font-bold">{user?.username}</span>?
            <br />
            This action will permanently remove the user from the system. This
            cannot be undone.
          </p>

          <div className="space-y-2 my-4">
            <Label>
              Type <span className="font-bold">{user?.username}</span> to
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
