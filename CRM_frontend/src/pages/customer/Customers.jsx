import { Main } from "@/components/main";
import { Button } from "@/components/ui/button";
import { useCustomer } from "@/hooks/queries/useCustomer";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { CustomerTable } from "./components/customer-table";
import useDialogState from "@/hooks/use-dialog-state";
import { CustomerAddModal } from "./components/customer-add-modal";

export default function Customers() {
  const [pagination, setPagination] = useState({ limit: 50, offset: 0 });
  const [filters, setFilters] = useState({
    dateFilter: "today",
    txnType: "all",
    currency: "all",
    startTime: "",
    endTime: "",
  });

  const { data: customer, isLoading } = useCustomer({
    ...pagination,
    ...filters,
  });
  const [dialogOpen, setDialogOpen] = useDialogState(null);

  return (
    <>
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Customer List</h2>
            <p className="text-muted-foreground">Manage your customers here.</p>
          </div>
          <Button className="space-x-1" onClick={() => setDialogOpen("add")}>
            <span>Add Customer</span> <UserPlus size={18} />
          </Button>
        </div>

        <CustomerTable
          data={customer?.items}
          isLoading={isLoading}
          total={customer?.total}
          limit={customer?.limit}
          offset={customer?.offset}
          message={customer?.message}
          onPaginationChange={setPagination}
          filters={filters}
          onFiltersChange={setFilters}
        />
        <CustomerAddModal
          open={dialogOpen === "add"}
          onOpenChange={() => setDialogOpen("add")}
        />
      </Main>
    </>
  );
}
