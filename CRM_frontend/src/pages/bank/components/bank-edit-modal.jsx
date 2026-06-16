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
import { BankUpdate } from "@/types/bank";
import { useUpdateBankMutation } from "@/hooks/mutations/useBank";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { LogoUploadField } from "@/components/logo-upload-field";
import { useBankById } from "@/hooks/queries/useBank";
import { useEffect } from "react";

export function BankEditModal({ open, onOpenChange, bankId }) {
  const { mutate, isPending } = useUpdateBankMutation();
  const { data: bankResponse } = useBankById(bankId);
  const bank = bankResponse?.data;
  const form = useForm({
    resolver: zodResolver(BankUpdate),
    defaultValues: {
      bank_name: "",
      description: "",
      logo: "",
    },
  });

  useEffect(() => {
    if (bank) {
      form.reset({
        bank_name: bank.bank_name || "",
        description: bank.description || "",
        logo: bank.logo || "",
      });
    }
  }, [bank, form]);
  const onSubmit = (data) => {
    mutate(
      { id: bankId, data },
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
          <DialogTitle>Edit Bank</DialogTitle>
          <DialogDescription>
            Update bank details here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3">
          <Form {...form}>
            <form
              id="bank-form"
              className="space-y-4 px-0.5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="bank_name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">
                      Bank Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. ACLEDA"
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
                      <Textarea
                        placeholder="Additional details..."
                        className="col-span-4 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => <LogoUploadField {...field} />}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type="submit" form="bank-form" disabled={isPending}>
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
