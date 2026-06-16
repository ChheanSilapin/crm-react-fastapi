import { BankApi } from "@/api/bankApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useBank = ({ limit = 50, offset = 0 } = {}) => {
    return useQuery({
        queryKey: ['banks', { limit, offset }],
        queryFn: () => BankApi.getBanks({ limit, offset }),
        placeholderData: keepPreviousData,
    });
};
export const useBankById = (bankId) => {
    return useQuery({
        queryKey: ['banks', bankId],
        queryFn: () => BankApi.getBank(bankId),
        enabled: !!bankId,
    });
};