import { CustomerApi } from "@/api/customerApi";
import { useQuery } from "@tanstack/react-query";

export const useCustomer = () => {
    return useQuery({
        queryKey: ['customers'],
        queryFn: () => CustomerApi.getCustomers(),
    });
};