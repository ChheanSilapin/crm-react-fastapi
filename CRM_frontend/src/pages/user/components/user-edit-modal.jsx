import { SelectDropdown } from "@/components/select-dropdown";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserUpdateSchema } from "@/types/user";
import { useUserUpdate } from "@/hooks/mutations/useUser";
import { Loader2 } from "lucide-react";
import { useUserById } from "@/hooks/queries/useUser";
import { useRolesQuery } from "@/hooks/queries/useRole";
import { useEffect } from "react";

export function UsersEditModal({ open, onOpenChange, userId }) {
  const { data: roles } = useRolesQuery();
  const { mutate, isPending } = useUserUpdate();
  const { data: userResponse } = useUserById(userId);
  const user = userResponse;
  const form = useForm({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      username: "",
      role_id: "",
      status: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        role_id: user.role?.id,
        status: user.status,
      });
    }
  }, [user, form]);

  const onSubmit = (data) => {
    mutate(
      { id: userId, data },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            {"Edit user here. "}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3">
          <Form {...form}>
            <form
              id="user-form"
              className="space-y-4 px-0.5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john_doe"
                        className="col-span-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">
                      Status
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={String(field.value)}
                      onValueChange={(val) => field.onChange(val)}
                      placeholder="Select status"
                      className="col-span-4 capitalize"
                      isControlled
                      items={[
                        { label: "Active", value: "active" },
                        { label: "Inactive", value: "inactive" },
                        { label: "Suspended", value: "suspended" },
                      ]}
                    />
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role_id"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Role</FormLabel>
                    <SelectDropdown
                      defaultValue={String(field.value)}
                      onValueChange={(val) => field.onChange(Number(val))}
                      placeholder="Select a role"
                      className="col-span-4 capitalize"
                      isControlled
                      items={
                        roles?.map((role) => ({
                          label: role.name,
                          value: String(role.id),
                        })) || []
                      }
                    />
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type="submit" form="user-form" disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
