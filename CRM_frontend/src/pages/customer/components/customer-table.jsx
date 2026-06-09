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
import { CalendarIcon, FileEditIcon, PlusCircleIcon, Trash2, UserIcon } from "lucide-react";

export function CustomerTable({
    data = [],
    isLoading,
}) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
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
                                        <span className="ml-auto text-xs font-mono text-muted-foreground">127</span>
                                    </CommandItem>
                                    <CommandItem>
                                        <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary opacity-50"></div>
                                        <span>Inactive</span>
                                        <span className="ml-auto text-xs font-mono text-muted-foreground">113</span>
                                    </CommandItem>
                                    <CommandItem>
                                        <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary opacity-50"></div>
                                        <span>Invited</span>
                                        <span className="ml-auto text-xs font-mono text-muted-foreground">139</span>
                                    </CommandItem>
                                    <CommandItem>
                                        <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary opacity-50"></div>
                                        <span>Suspended</span>
                                        <span className="ml-auto text-xs font-mono text-muted-foreground">121</span>
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
                            <TableHead>CustomerId</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="w-[150px]">Currency</TableHead>
                            <TableHead>Credit</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Bank</TableHead>
                            <TableHead>Note</TableHead>
                            <TableHead>CreateAt</TableHead>
                            <TableHead>CreateBy</TableHead>
                            <TableHead className="text-right w-[100px] pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    Loading customer......
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No customers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell className="font-medium">{customer.customer_id}</TableCell>
                                    <TableCell className="text-muted-foreground max-w-sm truncate">
                                        {customer.type}
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
                                    <TableCell className="text-muted-foreground max-w-sm truncate">
                                        {customer.note ? customer.note : '-'}
                                    </TableCell>

                                    <TableCell className="text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <CalendarIcon className="h-3.5 w-3.5" />
                                            <span>{new Date(customer.create_at).toLocaleDateString()}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <UserIcon className="h-3.5 w-3.5" />
                                            <span>{customer.create_by_user}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                            <FileEditIcon className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

        </div>
    );
}
