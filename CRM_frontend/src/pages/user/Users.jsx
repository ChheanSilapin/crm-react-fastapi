import { useUsersQuery } from "@/hooks/queries/useUser";
import { Main } from "@/components/main";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { UserTable } from "./components/user-table";
import { UsersAddModal } from "./components/user-add-modal";
import useDialogState from "@/hooks/use-dialog-state";
import { useState } from "react";

export default function Users() {
  const [pagination, setPagination] = useState({ limit: 10, offset: 0 });
  const { data: users, isLoading } = useUsersQuery(pagination);
  const [dialogOpen, setDialogOpen] = useDialogState(null);

  return (
    <>
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">User List</h2>
            <p className="text-muted-foreground">Manage your users here.</p>
          </div>
          <Button className="space-x-1" onClick={() => setDialogOpen("add")}>
            <span>Add User</span> <UserPlus size={18} />
          </Button>
        </div>
        <UserTable
          data={users?.items}
          isLoading={isLoading}
          total={users?.total}
          limit={users?.limit}
          offset={users?.offset}
          onPaginationChange={setPagination}
        />
        <UsersAddModal
          open={dialogOpen === "add"}
          onOpenChange={() => setDialogOpen("add")}
        />
      </Main>
    </>
  );
}
