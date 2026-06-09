import api from "./api";
import { CustomerResponse } from "@/types/customer";

export const CustomerApi = {
    getCustomers: async ({ limit = 50, offset = 0 } = {}) => {
        const response = await api.get(`/api/v1/customers?limit=${limit}&offset=${offset}&date_filter=all`);
        return CustomerResponse.parse(response.data);
    }
};