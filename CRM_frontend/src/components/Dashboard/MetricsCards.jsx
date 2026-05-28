import { useEffect } from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';
import { UsersIcon, BankIcon, CurrencyDollarIcon, TrendingUpIcon } from '../../icons';
import { useDashboard } from '../../hooks/useDashboard';
import { showToast } from '../../utils/toast';

// Default metrics structure
const DEFAULT_METRICS = [
  {
    id: 'customers',
    title: 'Total Customers',
    icon: <UsersIcon className="w-6 h-6" />,
    description: 'Active customer accounts',
    getValue: (metrics) => metrics?.total_customers?.toLocaleString() || '0'
  },
  {
    id: 'transactions',
    title: 'Total Transactions',
    icon: <CurrencyDollarIcon className="w-6 h-6" />,
    description: 'Completed transactions',
    getValue: (metrics) => metrics?.total_transactions?.toLocaleString() || '0'
  },
  {
    id: 'banks',
    title: 'Active Banks',
    icon: <BankIcon className="w-6 h-6" />,
    description: 'Partner banking institutions',
    getValue: (metrics) => metrics?.active_banks?.toString() || '0'
  }
];

const MetricsCards = () => {
  const { currentCurrency, currencies } = useCurrency();
  const { dashboardData, loading, error } = useDashboard();

  const formatAmountWithoutConversion = (amount, currencyCode) => {
    const currency = currencies[currencyCode];
    if (!currency) return amount;

    const decimals = currencyCode === 'KHR' ? 0 : 2;
    return `${currency.symbol}${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount)}`;
  };

  const getMetricsData = () => {
    if (!dashboardData?.metrics) return [];

    const { metrics } = dashboardData;

    // Calculate transaction volume
    const transactionVolume = currentCurrency === 'USD'
      ? parseFloat(metrics.transaction_volume_usd || 0)
      : parseFloat(metrics.transaction_volume_khr || 0);

    // Add volume metric
    const volumeMetric = {
      id: 'volume',
      title: `Transaction Volume (${currentCurrency})`,
      icon: <TrendingUpIcon className="w-6 h-6" />,
      description: 'Total transaction volume',
      getValue: () => formatAmountWithoutConversion(transactionVolume, currentCurrency)
    };

    return [...DEFAULT_METRICS, volumeMetric].map(metric => ({
      ...metric,
      value: metric.getValue(metrics)
    }));
  };

  if (loading) {
    return <MetricsLoadingSkeleton />;
  }

  if (error) {
    return <MetricsError error={error} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {getMetricsData().map((metric) => (
        <MetricCard key={metric.id} {...metric} />
      ))}
    </div>
  );
};

const MetricCard = ({ title, value, icon, description }) => (
  <div className="rounded-2xl border border-green-200 bg-white p-5 shadow-theme-sm dark:border-blue-400 dark:bg-white/[0.03] md:p-6">
    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800 border border-green-200 dark:border-blue-400">
      <div className="text-green-400 dark:text-blue-400">{icon}</div>
    </div>

    <div className="mt-5">
      <div className="mb-3">
        <span className="text-sm text-gray-500 dark:text-white">{title}</span>
        <h4 className="mt-1 font-bold text-gray-800 text-title-sm dark:text-white/90">{value}</h4>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
    </div>
  </div>
);

const MetricsLoadingSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="rounded-2xl border border-green-200 bg-white p-5 shadow-theme-sm dark:border-blue-400 dark:bg-white/[0.03] md:p-6 animate-pulse">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-5"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    ))}
  </div>
);

const MetricsError = () => {
  useEffect(() => {
    showToast.error('Failed to load dashboard metrics');
  }, []);
  return null;
};

export default MetricsCards;