import { CustomerApi } from "@/api/customerApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useCustomer = ({ limit = 50, offset = 0 } = {}) => {
    return useQuery({
        queryKey: ['customers', { limit, offset }],
        queryFn: () => CustomerApi.getCustomers({ limit, offset }),
        placeholderData: keepPreviousData,
    });
};