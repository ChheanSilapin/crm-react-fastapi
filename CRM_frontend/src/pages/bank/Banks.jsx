import { Main } from "@/components/main";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { BankTable } from "./components/bank-table";
import { useState } from "react";
import { useBank } from "@/hooks/queries/useBank";

export default function Banks() {
  const [pagination, setPagination] = useState({ limit: 10, offset: 0 });
  const { data: bankResponse, isLoading } = useBank({ limit: pagination.limit, offset: pagination.offset });

  const data = bankResponse?.items || [];
  const total = bankResponse?.total || 0;

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Bank List</h2>
            <p className='text-muted-foreground'>
              Manage your banks here.
            </p>
          </div>
          <Button className='space-x-1' >
            <span>Add Bank</span> <UserPlus size={18} />
          </Button>
        </div>
        <BankTable
          data={data}
          isLoading={isLoading}
          total={total}
          limit={pagination.limit}
          offset={pagination.offset}
          onPaginationChange={setPagination}
        />
      </Main>
    </>
  );
}
