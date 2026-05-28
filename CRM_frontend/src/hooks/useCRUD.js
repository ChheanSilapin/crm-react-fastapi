import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { showToast, RESOURCE_NAMES } from "../utils/toast";

const CACHE_CONFIG = {
  DASHBOARD_DURATION: 300000,
  USERS_DURATION: 300000,
  BANKS_DURATION: 300000,
  ROLES_DURATION: 600000,
  PERMISSIONS_DURATION: 600000,
  CUSTOMERS_DURATION: 300000,
};

const RETRY_CONFIG = { MAX_COUNT: 5, DELAY: 5000 };

const PAGINATION_CONFIG = {
  DEFAULT_ITEMS_PER_PAGE: 15,
  MOBILE_ITEMS_PER_PAGE: 10,
  MOBILE_BREAKPOINT: 640,
  PER_PAGE_OPTIONS: [40, 50, 60],
};

export const useCRUD = ({ resource, api, options = {} }) => {
  const queryClient = useQueryClient();
  const { isLoading: authLoading } = useAuth();

  const {
    cacheDuration = CACHE_CONFIG[`${resource.toUpperCase()}_DURATION`] ||
      300000,
    enablePagination = false,
    dataExtractor = null,
    queryKeyPrefix = [resource],
    customErrorHandlers = {},
    queryParams = {},
    ...queryOptions
  } = options;

  const QUERY_KEYS = {
    ALL: queryKeyPrefix,
    DETAIL: (id) => [...queryKeyPrefix, id],
    PAGINATED: (page, perPage, queryParams) => [
      ...queryKeyPrefix,
      "paginated",
      page,
      perPage,
      queryParams,
    ],
    DASHBOARD: ["dashboard", "overview"], // New key for the dashboard
  };

  const {
    data: rawData = enablePagination ? { data: [], pagination: {} } : [],
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: enablePagination
      ? QUERY_KEYS.PAGINATED(
          options.page || 1,
          options.perPage || PAGINATION_CONFIG.DEFAULT_ITEMS_PER_PAGE,
          queryParams
        )
      : QUERY_KEYS.ALL,
    queryFn: async () => {
      const params = enablePagination
        ? {
            page: options.page || 1,
            limit: options.perPage || PAGINATION_CONFIG.DEFAULT_ITEMS_PER_PAGE,
            ...queryParams,
          }
        : queryParams;
      const response = await api.getAll(params);

      const extractedData = dataExtractor
        ? dataExtractor(response)
        : response.data ||
          response[resource] ||
          (Array.isArray(response) ? response : []);

      if (enablePagination) {
        const apiPagination = response.pagination || {};
        const total = apiPagination.total || extractedData.length;
        const limit =
          apiPagination.limit ||
          options.perPage ||
          PAGINATION_CONFIG.DEFAULT_ITEMS_PER_PAGE;
        const offset = apiPagination.offset || 0;
        const currentPage = Math.floor(offset / limit) + 1;
        const lastPage = Math.ceil(total / limit);

        const pagination = {
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
        return { data: extractedData, pagination };
      }
      return extractedData;
    },
    staleTime: cacheDuration,
    gcTime: cacheDuration * 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: RETRY_CONFIG.MAX_COUNT,
    retryDelay: RETRY_CONFIG.DELAY,
    enabled: !authLoading,
    ...queryOptions,
  });

  const data = enablePagination ? rawData.data : rawData;
  const pagination = enablePagination ? rawData.pagination : null;
  const error = queryError ? `Failed to fetch ${resource}` : null;
  const resourceName =
    RESOURCE_NAMES[resource.slice(0, -1)] || resource.slice(0, -1);

  const createMutation = useMutation({
    mutationFn: api.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyPrefix });
      if (resource === "customers") {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
      }
      showToast.created(resourceName);
    },
    onError: (err) => {
      console.error(`Failed to create ${resource}:`, err);
      if (customErrorHandlers.create) {
        customErrorHandlers.create(err);
      } else {
        showToast.createError(resourceName, err);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data: updateData }) => api.update(id, updateData),
    onSuccess: (updatedItem, { id }) => {
      queryClient.setQueryData(QUERY_KEYS.DETAIL(id), updatedItem);
      queryClient.invalidateQueries({ queryKey: queryKeyPrefix });
      if (resource === "customers") {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
      }
      showToast.updated(resourceName);
    },
    onError: (err) => {
      console.error(`Failed to update ${resource}:`, err);
      showToast.updateError(resourceName, err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.delete,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.DETAIL(id) });
      queryClient.invalidateQueries({ queryKey: queryKeyPrefix });
      if (resource === "customers") {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
      }
      showToast.deleted(resourceName);
    },
    onError: (err) => {
      console.error(`Failed to delete ${resource}:`, err);
      if (customErrorHandlers.delete) {
        customErrorHandlers.delete(err);
      } else {
        showToast.deleteError(resourceName, err);
      }
    },
  });

  const getById = (id) =>
    data?.find(
      (item) => item.id === id || item[`${resource.slice(0, -1)}_id`] === id
    );
  const isUnique = (field, value, excludeId = null) =>
    !data?.some(
      (item) =>
        item[field]?.toLowerCase() === value?.toLowerCase() &&
        item.id !== excludeId
    );
  const refresh = () => refetch();

  return {
    [resource]: data,
    data,
    loading,
    error,
    pagination,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    getById,
    isUnique,
    refresh,
    refetch,
    queryKeys: QUERY_KEYS,
  };
};

export default useCRUD;
