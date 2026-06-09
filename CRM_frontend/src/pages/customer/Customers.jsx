import { Main } from "@/components/main";
import { Button } from "@/components/ui/button";
import { useCustomer } from "@/hooks/queries/useCustomer";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { CustomerTable } from "./components/customer-table";

export default function Customers() {
  const [pagination, setPagination] = useState({ limit: 10, offset: 0 });
  const { data: customer, isLoading } = useCustomer(pagination);

  return (
    <>
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Customer List</h2>
            <p className="text-muted-foreground">Manage your customers here.</p>
          </div>
          <Button className="space-x-1">
            <span>Add Customer</span> <UserPlus size={18} />
          </Button>
        </div>

        <CustomerTable
          data={customer?.items}
          isLoading={isLoading}
          total={customer?.total}
          limit={customer?.limit}
          offset={customer?.offset}
          onPaginationChange={setPagination}
        />
      </Main>
    </>
  );
}
