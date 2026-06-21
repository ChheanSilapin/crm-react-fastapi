import { Main } from "@/components/main";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { RoleTable } from "./components/role-table";
import { RoleAddModal } from "./components/role-add-modal";
import useDialogState from "@/hooks/use-dialog-state";
import { useState } from "react";
import { useRolesQuery } from "@/hooks/queries/useRole";

export default function Roles() {
  const [pagination, setPagination] = useState({ limit: 10, offset: 0 });
  const { data: roles, isLoading } = useRolesQuery(pagination);
  const [dialogOpen, setDialogOpen] = useDialogState(null);

  return (
    <>
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Roles List</h2>
            <p className="text-muted-foreground">Manage your roles here.</p>
          </div>
          <Button className="space-x-1" onClick={() => setDialogOpen("add")}>
            <span>Add Role</span> <UserPlus size={18} />
          </Button>
        </div>
        <RoleTable
          data={roles?.items}
          isLoading={isLoading}
          total={roles?.total}
          limit={roles?.limit}
          offset={roles?.offset}
          onPaginationChange={setPagination}
        />
        <RoleAddModal
          open={dialogOpen === "add"}
          onOpenChange={() => setDialogOpen("add")}
        />
      </Main>
    </>
  );
}
