import api from "./api";
import { BankCreate, BankDeleteResponse, BankListResponse, BankResponse, BankUpdate } from "@/types/bank";

export const BankApi = {
    getBanks: async ({ limit = 50, offset = 0 } = {}) => {
        const response = await api.get(`/api/v1/banks?limit=${limit}&offset=${offset}`);
        return BankListResponse.parse(response.data);
    },
    getBank: async (id) => {
        const response =  await api.get(`/api/v1/banks/${id}`);
        return BankResponse.parse(response.data);
    },
    createBank: async (bank) => {
        const validate = BankCreate.parse(bank);
        
        const formData = new FormData();
        formData.append("bank_name", validate.bank_name);
        if (validate.description) {
            formData.append("description", validate.description);
        }
        if (validate.logo && validate.logo.length > 0) {
            formData.append("logo", validate.logo[0]); 
        }

        const response = await api.post(`/api/v1/banks`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return BankResponse.parse(response.data);
    },
    updateBank: async ( id,bank ) => {
    const formData = new FormData();
    const validate = BankUpdate.parse(bank);
    
    if (validate.bank_name !== undefined) formData.append("bank_name", validate.bank_name);
    if (validate.description !== undefined) formData.append("description", validate.description);
    if (validate.logo && validate.logo.length > 0) {
        formData.append("logo", validate.logo[0]);
    }

    const response = await api.put(`/api/v1/banks/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return BankResponse.parse(response.data);
  },
    deleteBank:async (id)=>{
        const response = await api.delete(`/api/v1/banks/${id}`);
        return BankDeleteResponse.parse(response.data);
    }
    
};