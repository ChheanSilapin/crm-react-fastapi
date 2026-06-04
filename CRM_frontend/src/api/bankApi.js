import api from "./api";
import { BankResponse } from "@/types/bank";

export const BankApi = {
    getBanks: async ({ limit = 50, offset = 0 } = {}) => {
        const response = await api.get(`/api/v1/banks?limit=${limit}&offset=${offset}`);
        return BankResponse.parse(response.data);
    }
};