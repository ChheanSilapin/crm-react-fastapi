import api from "./api";
import { CustomerBase, CustomerCreateSchema, CustomerListResponse, CustomerResponse } from "@/types/customer";

export const CustomerApi = {
    getCustomers: async (params = {}) => {
        const { limit = 10, offset = 0, dateFilter = "today", txnType = "all", currency = "all", startTime, endTime } = params;
        const page = Math.floor(offset / limit) + 1;
        
        const queryParams = new URLSearchParams({
            limit,
            page,
            date_filter: dateFilter,
        });

        if (txnType !== "all") queryParams.append("type", txnType);
        if (currency !== "all") queryParams.append("currency", currency);
        if (dateFilter === "custom") {
            if (startTime) queryParams.append("start_date", startTime);
            if (endTime) queryParams.append("end_date", endTime);
        }

        const response = await api.get(`/api/v1/customers?${queryParams.toString()}`);
        return CustomerListResponse.parse(response.data);
    },
    createCustomer :  async (data) => {
        const validatedData = CustomerCreateSchema.parse(data);
        const response = await api.post(`/api/v1/customers`, validatedData);
        return CustomerResponse.parse(response.data);
    }
};