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
import { PlusCircleIcon, Check } from "lucide-react";
import { groupPermissions } from "@/lib/utils";

export function PermissionTable({ data = [], isLoading }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Filter permissions..."
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
              <TableHead>Permission Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Create</TableHead>
              <TableHead className="text-center">Read</TableHead>
              <TableHead className="text-center">Update</TableHead>
              <TableHead className="text-center">Delete</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">List</TableHead>
              <TableHead className="text-center">Export</TableHead>
              <TableHead className="text-center">Admin</TableHead>
              <TableHead className="text-center">Assign</TableHead>
              <TableHead className="text-center">Audit</TableHead>
              <TableHead className="text-center">Backup</TableHead>
              <TableHead className="text-center">Maintenance</TableHead>
              <TableHead className="text-center">View</TableHead>
              <TableHead className="text-center">Generate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="h-24 text-center text-muted-foreground"
                >
                  Loading permissions......
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="h-24 text-center text-muted-foreground"
                >
                  No permissions found.
                </TableCell>
              </TableRow>
            ) : (
              groupPermissions(data).map((group) => (
                <TableRow key={group.resource}>
                  <TableCell className="font-medium capitalize">
                    {group.resource}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-sm truncate capitalize">
                    Manage {group.resource}
                  </TableCell>
                  <TableCell className="text-center">
                    {group.permissions["create"] ? (
                      <Check className="mx-auto h-4 w-4 text-green-500" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {group.permissions["read"] ? (
                      <Check className="mx-auto h-4 w-4 text-green-500" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {group.permissions["update"] ? (
                      <Check className="mx-auto h-4 w-4 text-green-500" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {group.permissions["delete"] ? (
                      <Check className="mx-auto h-4 w-4 text-green-500" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {group.permissions["status"] ? (
                      <Check className="mx-auto h-4 w-4 text-green-500" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {group.permissions["list"] ? (
                      <Check className="mx-auto h-4 w-4 text-green-500" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {group.permissions["export"] ? (
                      <Check className="mx-auto h-4 w-4 text-green-500" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {group.permissions["admin"] ? (
                      <Check className="mx-auto h-4 w-4 text-green-500" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {group.permissions["assign"] ? (
                      <Check className="mx-auto h-4 w-4 text-green-500" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {group.permissions["audit"] ? (
                      <Check className="mx-auto h-4 w-4 text-green-500" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {group.permissions["backup"] ? (
                      <Check className="mx-auto h-4 w-4 text-green-500" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {group.permissions["maintenance"] ? (
                      <Check className="mx-auto h-4 w-4 text-green-500" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {group.permissions["view"] ? (
                      <Check className="mx-auto h-4 w-4 text-green-500" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {group.permissions["generate"] ? (
                      <Check className="mx-auto h-4 w-4 text-green-500" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
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
