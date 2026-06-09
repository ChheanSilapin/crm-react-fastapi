import api from "./api";
import { CustomerResponse } from "@/types/customer";

export const CustomerApi = {
    getCustomers: async () => {
        const response = await api.get(`/api/v1/customers?all_customers=true`);
        return CustomerResponse.parse(response.data);
    }
};