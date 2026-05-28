import { useDashboard } from '../../hooks/useDashboard';

const SystemStatus = () => {
  const { dashboardData, loading, error } = useDashboard();

  const calculateStats = () => {
    const { metrics, monthlyStats } = dashboardData;
    const calculateGrowthPercentage = (current, previous) => {
      if (!previous || previous === 0) return '0%';
      const growth = ((current - previous) / previous) * 100;
      return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
    };

    if (!metrics || Object.keys(metrics).length === 0) {
      return [
        { label: 'Deposit Customers', value: '0', change: '0%', positive: true },
        { label: 'Withdraw Transactions', value: '0', change: '0%', positive: true },
        { label: 'System Uptime', value: '0%', change: '0%', positive: true },
        { label: 'Daily Transactions', value: '0', change: '0%', positive: true },
      ];
    }

    let depositCustomersChange = '0%';
    let withdrawTransactionsChange = '0%';
    let dailyTransactionsChange = '0%';

    if (monthlyStats && monthlyStats.length >= 2) {
      const currentMonth = monthlyStats[monthlyStats.length - 1];
      const previousMonth = monthlyStats[monthlyStats.length - 2];

      const currentDepositCustomers = currentMonth.deposit_customer || 0;
      const previousDepositCustomers = previousMonth.deposit_customer || 0;
      depositCustomersChange = calculateGrowthPercentage(currentDepositCustomers, previousDepositCustomers);

      const currentWithdraws = currentMonth.withdraw_transactions || 0;
      const previousWithdraws = previousMonth.withdraw_transactions || 0;
      withdrawTransactionsChange = calculateGrowthPercentage(currentWithdraws, previousWithdraws);
      
      dailyTransactionsChange = calculateGrowthPercentage(currentMonth.transactions, previousMonth.transactions);
    }

    return [
      {
        label: 'Deposit Customers',
        value: Number(metrics.deposit_customer || 0).toLocaleString(),
        change: depositCustomersChange,
        positive: !depositCustomersChange.startsWith('-')
      },
      {
        label: 'Withdraw Transactions',
        value: Number(metrics.withdraw_transactions || 0).toLocaleString(),
        change: withdrawTransactionsChange,
        positive: !withdrawTransactionsChange.startsWith('-')
      },
      {
        label: 'System Uptime',
        value: `${metrics.system_uptime || 0}%`,
        change: '+0.1%',
        positive: true
      },
      {
        label: 'Daily Transactions',
        value: Number(metrics.daily_transactions || 0).toLocaleString(),
        change: dailyTransactionsChange,
        positive: !dailyTransactionsChange.startsWith('-')
      },
    ];
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">System Status</h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Current system metrics</p>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center justify-between animate-pulse">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">Error loading system status: {error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">System Status</h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Current system metrics</p>
      </div>
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{stat.label}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
            <div className="text-right">
              <span className={`text-sm font-medium ${
                stat.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemStatus;