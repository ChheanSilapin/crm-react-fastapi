import { CustomerApi } from "@/api/customerApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useCustomer = (params = {}) => {
    return useQuery({
        queryKey: ['customers', params],
        queryFn: () => CustomerApi.getCustomers(params),
        placeholderData: keepPreviousData,
        
    });
};

export const useCustomerById = (id) => {
    return useQuery({
        queryKey: ['customers', id],
        queryFn: () => CustomerApi.getById(id),
        enabled: !!id,
    });
};