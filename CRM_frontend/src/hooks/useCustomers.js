// Import necessary modules and configuration
import { useCRUD } from "./useCRUD";
import { customerAPI } from "../api/api";

// Configuration constants for default and mobile pagination
const DEFAULT_ITEMS_PER_PAGE = 15;
const MOBILE_ITEMS_PER_PAGE = 10;
const MOBILE_BREAKPOINT = 640;

export const useCustomers = (
  page = 1,
  perPage = null,
  searchTerm = "",
  typeFilter = "All Types",
  localCurrency = "All Currencies",
  dateFilter = null,
  timeStart = "",
  timeEnd = ""
) => {
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const actualPerPage =
    perPage || (isMobile ? MOBILE_ITEMS_PER_PAGE : DEFAULT_ITEMS_PER_PAGE);

  // Build query parameters
  const queryParams = {
    page,
    limit: actualPerPage,
  };

  // Add date filter if provided
  if (dateFilter && String(dateFilter).trim() !== "") {
    if (dateFilter === "all_customers") {
      queryParams.all_customers = true;
    } else {
      queryParams.create_at = dateFilter;
    }
  }

  // Add optional time-of-day range if provided (HH:MM)
  if (timeStart) queryParams.start_time = timeStart;
  if (timeEnd) queryParams.end_time = timeEnd;

  // Add optional currency/type filters when not default
  if (localCurrency && localCurrency !== "All Currencies") {
    queryParams.currency = localCurrency;
  }
  if (typeFilter && typeFilter !== "All Types") {
    queryParams.type = typeFilter;
  }

  const {
    data,
    loading,
    error,
    pagination,
    message,
    create,
    update,
    delete: deleteCustomer,
    isCreating,
    isUpdating,
    isDeleting,
    getById,
    isUnique,
    refresh,
    refetch,
  } = useCRUD({
    resource: "customers",
    api: customerAPI,
    options: {
      enablePagination: true,
      queryParams,
      page,
      perPage: actualPerPage,

      dataExtractor: (response) => {
        const extractedData = response.data || response;
        const apiPagination = response.pagination || {};
        const apiMessage = response.message || null;
        console.log(response);
        const {
          total = extractedData.length,
          limit = actualPerPage,
          offset = 0,
        } = apiPagination;
        const currentPage = Math.floor(offset / limit) + 1;
        const lastPage = Math.ceil(total / limit);

        const finalPagination = {
          current_page: currentPage,
          per_page: limit,
          total: total,
          from: extractedData.length > 0 ? offset + 1 : 0,
          to: offset + extractedData.length,
          has_next: currentPage < lastPage,
          has_prev: currentPage > 1,
          ...apiPagination,
          last_page: lastPage,
        };
        return {
          data: extractedData,
          pagination: finalPagination,
          message: apiMessage,
        };
      },
    },
  });

  // Customer-specific utility to find a customer by ID
  const getCustomerById = (id) =>
    data.find((c) => c.id === id || c.customer_id === id);

  return {
    customers: data,
    loading,
    error,
    pagination,
    message,
    create,
    update,
    delete: deleteCustomer,
    isCreating,
    isUpdating,
    isDeleting,
    getById,
    isUnique,
    refresh,
    refetch,
    getCustomerById,
  };
};
