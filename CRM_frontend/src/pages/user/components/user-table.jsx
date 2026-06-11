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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusColors = {
  active: "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200",
  inactive:
    "bg-neutral-300/40 border-neutral-300 text-neutral-800 dark:text-neutral-300",
};

export function UserTable({ data = [], isLoading }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Filter users..."
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
              <TableHead>Username</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[150px]">Role</TableHead>
              <TableHead>CreateAt</TableHead>
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
                  Loading users......
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell className="text-muted-foreground max-w-sm truncate">
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize",
                        statusColors[user.status?.toLowerCase()] ||
                          "bg-neutral-100 text-neutral-800",
                      )}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-sm truncate">
                    {user.role.name}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      <span>
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right pr-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
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
    </div>
  );
}
