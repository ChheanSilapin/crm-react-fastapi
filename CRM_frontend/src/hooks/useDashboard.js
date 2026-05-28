import { useQuery, useQueryClient } from '@tanstack/react-query';
import { dashboardAPI } from '../api/api';

const CACHE_DURATION = 120000;
const QUERY_KEY = ['dashboard', 'overview'];

export const useDashboard = () => {
  const queryClient = useQueryClient();

  const {
    data: dashboardData = {
      metrics: {},
      activities: [],
      monthlyStats: [],
      transactions: [],
      banks: []
    },
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: dashboardAPI.getOverview,
    staleTime: CACHE_DURATION,
    gcTime: CACHE_DURATION * 2.5,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const error = queryError ? 'Failed to fetch dashboard data' : null;

  const updateCache = async (apiCall, key) => {
    try {
      const data = await apiCall();
      queryClient.setQueryData(QUERY_KEY, (old) => ({
        ...old,
        [key]: data || [],
      }));
    } catch {
      // Fail silently as before
    }
  };

  const refreshMetrics = () => updateCache(dashboardAPI.getMetrics, 'metrics');
  const refreshActivities = () => updateCache(dashboardAPI.getRecentActivities, 'activities');

  return {
    dashboardData,
    loading,
    error,
    refetch,
    refreshMetrics,
    refreshActivities,
  };
};