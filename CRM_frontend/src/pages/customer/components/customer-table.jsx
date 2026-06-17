import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarIcon,
  FileEditIcon,
  PlusCircleIcon,
  Trash2,
  UserIcon,
} from "lucide-react";
import { TablePagination } from "@/components/ui/pagination";

import { CustomerFilters } from "./customer-filters";
import { cn, truncateWords } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { CustomerEditModal } from "./customer-edit-modal";

const typeColors = {
  deposit: "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200",
  withdrawal:
    "bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200",
};
export function CustomerTable({
  data = [],
  isLoading,
  total,
  limit,
  offset,
  message,
  onPaginationChange,
  filters,
  onFiltersChange,
}) {
  const [editingCustomerId, setEditingCustomerId] = useState(null);

  return (
    <div className="flex flex-col gap-4">
      <CustomerFilters filters={filters} onFiltersChange={onFiltersChange}>
        <Input
          placeholder="Filter customer..."
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </CustomerFilters>

      <div className="overflow-hidden rounded-md border bg-background shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>CustomerId</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="w-[150px]">Currency</TableHead>
              <TableHead>Credit</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Bank</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>CreateAt</TableHead>
              <TableHead>CreateBy</TableHead>
              <TableHead className="text-right w-[100px] pr-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="h-24 text-center text-muted-foreground"
                >
                  Loading customer......
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="h-24 text-center text-muted-foreground"
                >
                  {message || "No customers found."}
                </TableCell>
              </TableRow>
            ) : (
              data.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.customer_id}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-sm truncate">
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize",
                        typeColors[customer.type?.toLowerCase()] ||
                          "bg-neutral-100 text-neutral-800",
                      )}
                    >
                      {customer.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-sm truncate">
                    {customer.currency}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-sm truncate">
                    {customer.credit}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-sm truncate">
                    {customer.amount}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-sm truncate">
                    {customer.bank.bank_name}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-sm">
                    {truncateWords(customer.note ? customer.note : "-", 1)}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      <span>
                        {new Date(customer.create_at).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <UserIcon className="h-3.5 w-3.5" />
                      <span>{customer.created_by_user.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setEditingCustomerId(customer.id)}
                    >
                      <FileEditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        total={total}
        limit={limit}
        offset={offset}
        onPaginationChange={onPaginationChange}
      />
      {editingCustomerId && (
        <CustomerEditModal
          open={!!editingCustomerId}
          onOpenChange={(open) => !open && setEditingCustomerId(null)}
          customerId={editingCustomerId}
        />
      )}
    </div>
  );
}
