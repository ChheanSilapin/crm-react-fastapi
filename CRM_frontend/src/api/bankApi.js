import { apiRequest } from "./axios";

export const bankAPI = {
  getAll: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.append("limit", params.limit);

    if (params.page && params.limit) {
      const offset = (params.page - 1) * params.limit;
      searchParams.append("offset", offset);
    } else if (params.offset) {
      searchParams.append("offset", params.offset);
    }

    const queryString = searchParams.toString();
    const response = await apiRequest(
      `/v1/banks${queryString ? `?${queryString}` : ""}`
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
      };
    }
    console.log(response.items);
    return response;
  },

  getById: async (id) => {
    const response = await apiRequest(`/v1/banks/${id}`);
    return response;
  },

  create: async (bankData) => {
    const fd = new FormData();
    if (bankData?.bank_name != null) fd.append("bank_name", bankData.bank_name);
    if (bankData?.description != null)
      fd.append("description", bankData.description);
    if (bankData?.logo instanceof File) fd.append("logo", bankData.logo);
    const response = await apiRequest("/v1/banks", {
      method: "POST",
      data: fd,
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(response);
    return response;
  },

  update: async (id, bankData) => {
    if (bankData?.logo instanceof File) {
      try {
        await bankAPI.uploadLogo(id, bankData.logo); // This call will now work
      } catch (error) {
        console.error("Failed to upload logo:", error);
        throw error;
      }
    }

    const payload = { ...bankData };
    delete payload.logo;

    try {
      const response = await apiRequest(`/v1/banks/${id}`, {
        method: "PUT",
        data: payload,
      });
      return response;
    } catch (error) {
      console.error("Failed to update bank data:", error);
      throw error;
    }
  },

  uploadLogo: async (id, file) => {
    const fd = new FormData();
    fd.append("logo", file);
    const response = await apiRequest(`/v1/banks/${id}/logo`, {
      method: "PUT",
      data: fd,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  },

  delete: async (id) => {
    const response = await apiRequest(`/v1/banks/${id}`, {
      method: "DELETE",
    });
    return response;
  },
};


