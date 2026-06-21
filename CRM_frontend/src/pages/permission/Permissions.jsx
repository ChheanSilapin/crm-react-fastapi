import { Main } from "@/components/main";
import { PermissionTable } from "./components/permission-table";
import { usePermissionQuery } from "@/hooks/queries/usePermission";

export default function Permissions() {
  const { data: permissions, isLoading } = usePermissionQuery();

  return (
    <>
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Permissions List
            </h2>
            <p className="text-muted-foreground">
              Manage your permissions here.
            </p>
          </div>
        </div>
        <PermissionTable data={permissions} isLoading={isLoading} />
      </Main>
    </>
  );
}
