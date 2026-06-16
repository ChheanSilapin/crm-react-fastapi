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
import { Textarea } from "@/components/ui/textarea";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerUpdateSchema } from "@/types/customer";
import { useCustomerUpdateMutation } from "@/hooks/mutations/useCustomer";
import { Loader2 } from "lucide-react";
import { useCustomerById } from "@/hooks/queries/useCustomer";
import { useBank } from "@/hooks/queries/useBank";
import { useEffect } from "react";

export function CustomerEditModal({ open, onOpenChange, customerId }) {
  const { data: banks } = useBank();
  const { mutate, isPending } = useCustomerUpdateMutation();
  const { data: customerResponse } = useCustomerById(customerId);
  const customer = customerResponse?.data;

  const form = useForm({
    resolver: zodResolver(CustomerUpdateSchema),
    defaultValues: {
      customer_id: "",
      type: "",
      currency: "",
      bank_id: "",
      credit: "",
      amount: "",
      note: "",
    },
  });

  useEffect(() => {
    if (customer) {
      form.reset({
        customer_id: customer.customer_id || "",
        type: customer.type || "",
        currency: customer.currency || "",
        bank_id: customer.bank?.bank_id || "",
        credit: customer.credit ? Number(customer.credit) : undefined,
        amount: customer.amount ? Number(customer.amount) : undefined,
        note: customer.note || "",
      });
    }
  }, [customer, form]);

  const onSubmit = (data) => {
    mutate(
      { id: customerId, data },
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
          <DialogTitle>Edit Customer</DialogTitle>
          <DialogDescription>
            Update customer details here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3">
          <Form {...form}>
            <form
              id="customer-form"
              className="space-y-4 px-0.5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="customer_id"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">
                      Customer ID
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. CUST-001"
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
                name="type"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">
                      Transaction Type
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      isControlled
                      placeholder="Transaction type"
                      className="col-span-4 capitalize"
                      items={[
                        { label: "Deposit", value: "Deposit" },
                        { label: "Withdrawal", value: "Withdrawal" },
                      ]}
                    />
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">
                      Currency
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      isControlled
                      placeholder="Select currency"
                      className="col-span-4 capitalize"
                      items={[
                        { label: "USD", value: "USD" },
                        { label: "KHR", value: "KHR" },
                        { label: "EUR", value: "EUR" },
                      ]}
                    />
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bank_id"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Bank</FormLabel>
                    <SelectDropdown
                      defaultValue={
                        field.value ? String(field.value) : undefined
                      }
                      onValueChange={(val) => field.onChange(Number(val))}
                      isControlled
                      placeholder="Select a bank"
                      className="col-span-4 capitalize"
                      items={
                        banks?.items?.map((bank) => ({
                          label: bank.bank_name,
                          value: String(bank.bank_id),
                        })) || []
                      }
                    />
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="credit"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">
                      Credit
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="col-span-4"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">
                      Amount
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="col-span-4"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Note</FormLabel>
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
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type="submit" form="customer-form" disabled={isPending}>
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
