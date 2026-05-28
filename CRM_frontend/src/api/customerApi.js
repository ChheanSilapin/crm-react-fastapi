import { apiRequest } from "./axios";

export const customerAPI = {
  getAll: async (params = {}) => {
    const searchParams = new URLSearchParams();
    for (const key in params) {
      if (params[key]) {
        searchParams.append(key, params[key]);
      }
    }
    const queryString = searchParams.toString();
    const response = await apiRequest(
      `/v1/customers${queryString ? `?${queryString}` : ""}`
    );

    if (response.items) {
      return {
        data: response.items,
        pagination: {
          total: response.total,
          limit: response.limit,
          offset: response.offset,
          page: response.page,
          pages: response.pages,
          has_next: response.has_next,
          has_prev: response.has_prev,
        },
        message: response.message,
      };
    }

    return {
      data: response.items || [],
      pagination: response.pagination || {},
      message: response.message || "An unexpected error occurred.",
    };
  },

  getById: async (id) => {
    const response = await apiRequest(`/v1/customers/${id}`);
    return response;
  },

  create: async (customerData) => {
    const response = await apiRequest("/v1/customers", {
      method: "POST",
      data: customerData,
    });
    return response;
  },

  update: async (id, customerData) => {
    const response = await apiRequest(`/v1/customers/${id}`, {
      method: "PUT",
      data: customerData,
    });
    return response;
  },

  delete: async (id) => {
    const response = await apiRequest(`/v1/customers/${id}`, {
      method: "DELETE",
    });
    return response;
  },
};

// Export individual functions for direct import
export const getAllCustomers = customerAPI.getAll;
export const getCustomerById = customerAPI.getById;
export const createCustomer = customerAPI.create;
export const updateCustomer = customerAPI.update;
export const deleteCustomer = customerAPI.delete;
