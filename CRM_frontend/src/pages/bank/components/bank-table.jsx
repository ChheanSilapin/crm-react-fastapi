import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
} from "lucide-react";
import { TablePagination } from "@/components/ui/pagination";
import { getImageUrl } from "@/lib/utils";
import { useState } from "react";
import { BankDeleteDialog } from "./bank-delete-modal";
import { BankEditModal } from "./bank-edit-modal";

export function BankTable({
  data = [],
  isLoading,
  total,
  limit,
  offset,
  onPaginationChange,
}) {
  const [deleteBank, setDeleteBank] = useState(null);
  const [editingBankId, setEditingBankId] = useState(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Filter banks..."
          className="h-8 w-[150px] lg:w-[250px]"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed">
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Status
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Status" />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem>
                    <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary">
                      {/* Unchecked state */}
                    </div>
                    <span>Active</span>
                    <span className="ml-auto text-xs font-mono text-muted-foreground">
                      127
                    </span>
                  </CommandItem>
                  <CommandItem>
                    <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary opacity-50"></div>
                    <span>Inactive</span>
                    <span className="ml-auto text-xs font-mono text-muted-foreground">
                      113
                    </span>
                  </CommandItem>
                  <CommandItem>
                    <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary opacity-50"></div>
                    <span>Invited</span>
                    <span className="ml-auto text-xs font-mono text-muted-foreground">
                      139
                    </span>
                  </CommandItem>
                  <CommandItem>
                    <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary opacity-50"></div>
                    <span>Suspended</span>
                    <span className="ml-auto text-xs font-mono text-muted-foreground">
                      121
                    </span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed">
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Role
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Role" />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem>
                    <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary opacity-50"></div>
                    <span>Admin</span>
                  </CommandItem>
                  <CommandItem>
                    <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary opacity-50"></div>
                    <span>Manager</span>
                  </CommandItem>
                  <CommandItem>
                    <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary opacity-50"></div>
                    <span>User</span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="overflow-hidden rounded-md border bg-background shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[80px] pl-6">Logo</TableHead>
              <TableHead>Bank Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[150px]">Added Date</TableHead>
              <TableHead className="text-right w-[100px] pr-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Loading banks...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No banks found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((bank) => (
                <TableRow key={bank.bank_id}>
                  <TableCell className="pl-6">
                    <Avatar className="h-10 w-10 border bg-background shadow-sm">
                      <AvatarImage
                        src={getImageUrl(bank.logo)}
                        alt={bank.bank_name}
                        className="object-contain p-1"
                      />
                      <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">
                        {bank.bank_name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">
                    {bank.bank_name}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-sm truncate">
                    {bank.description}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      <span>
                        {new Date(bank.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingBankId(bank.bank_id)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <FileEditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => setDeleteBank(bank)}
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

      <BankDeleteDialog
        open={!!deleteBank}
        onOpenChange={(open) => !open && setDeleteBank(null)}
        bank={deleteBank}
      />
      {editingBankId && (
        <BankEditModal
          open={!!editingBankId}
          onOpenChange={(open) => !open && setEditingBankId(null)}
          bankId={editingBankId}
        />
      )}
    </div>
  );
}
