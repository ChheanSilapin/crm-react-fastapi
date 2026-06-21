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
import { Loader2 } from "lucide-react";
import { RoleCreate } from "@/types/role";
import { useRoleMutation } from "@/hooks/mutations/useRole";

export function RoleAddModal({ open, onOpenChange }) {
  const { mutate, isPending } = useRoleMutation();
  const form = useForm({
    resolver: zodResolver(RoleCreate),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess: () => {
        onOpenChange();
        form.reset();
      },
    });
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
          <DialogTitle>Add Role User</DialogTitle>
          <DialogDescription>
            {"Create new user here. "}
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
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">
                      Role Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="role_name"
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
                name="description"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="write description..."
                        className="col-span-4"
                        {...field}
                      />
                    </FormControl>
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
