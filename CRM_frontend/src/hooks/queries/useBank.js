import { BankApi } from "@/api/bankApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useBank = ({ limit = 50, offset = 0 } = {}) => {
    return useQuery({
        queryKey: ['banks', { limit, offset }],
        queryFn: () => BankApi.getBanks({ limit, offset }),
        placeholderData: keepPreviousData,
    });
};