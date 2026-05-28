import { customerAPI } from "./customerApi";
import { bankAPI } from "./bankApi";

const calculateDashboardMetrics = (customers, banks) => {
  const now = new Date();
  const totalCustomers = customers.length;
  const totalBanks = banks.length;

  const transactionData = {
    usd: 0,
    khr: 0,
    deposits: 0,
    withdraws: 0,
    daily: 0,
  };

  const today = new Date().toDateString();

  customers.forEach((t) => {
    // Calculate transaction metrics in a single loop
    if (t.currency === "USD") transactionData.usd += parseFloat(t.amount || 0);
    if (t.currency === "KHR") transactionData.khr += parseFloat(t.amount || 0);
    if (t.type === "Deposit") transactionData.deposits++;
    if (t.type === "Withdrawal") transactionData.withdraws++;
    if (new Date(t.create_at).toDateString() === today) transactionData.daily++;
  });

  return {
    id: 1,
    date: now.toISOString().split("T")[0],
    total_customers: totalCustomers,
    total_transactions: customers.length, // Assuming customers are transactions
    active_banks: totalBanks,
    transaction_volume_usd: transactionData.usd,
    transaction_volume_khr: transactionData.khr,
    deposit_customer: transactionData.deposits,
    withdraw_transactions: transactionData.withdraws,
    system_uptime: 99.9,
    daily_transactions: transactionData.daily,
  };
};

const calculateMonthlyStats = (customers, banks) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentDate = new Date();
  const stats = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthName = monthNames[month];
    const endOfMonth = new Date(year, month + 1, 0);

    const customersUpToMonth = customers.filter(
      (c) => new Date(c.created_at || c.joinDate) <= endOfMonth
    ).length;
    const banksUpToMonth = banks.filter(
      (b) => new Date(b.created_at) <= endOfMonth
    ).length;

    const transactionsInMonth = customers.filter(
      (t) =>
        new Date(t.created_at).getFullYear() === year &&
        new Date(t.created_at).getMonth() === month
    );

    const depositCount = transactionsInMonth.filter(
      (t) => t.type === "Deposit"
    ).length;
    const withdrawCount = transactionsInMonth.filter(
      (t) => t.type === "Withdraw"
    ).length;

    const completedTransactions = transactionsInMonth.filter(
      (t) => t.status === "completed"
    );

    const transactionVolumeUSD = completedTransactions
      .filter((t) => t.currency === "USD")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const transactionVolumeKHR = completedTransactions
      .filter((t) => t.currency === "KHR")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    stats.push({
      id: stats.length + 1,
      month: monthName,
      year: year,
      customers: customersUpToMonth,
      transactions: transactionsInMonth.length,
      deposit_customer: depositCount,
      withdraw_transactions: withdrawCount,
      banks: banksUpToMonth,
      transaction_volume_usd: transactionVolumeUSD,
      transaction_volume_khr: transactionVolumeKHR,
    });
  }

  return stats;
};

const generateRecentActivities = (customers, banks) => {
  // Logic remains mostly the same, as it's efficient already
  const activities = [];

  const recentTransactions = customers
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
  recentTransactions.forEach((transaction) => {
    const customerName =
      transaction.name || `Customer #${transaction.customer_id}`;
    const customerId =
      transaction.CustomerId || `CUST-${transaction.customer_id}`;

    activities.push({
      id: activities.length + 1,
      type: transaction.type,
      title: `${
        transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)
      } processed`,
      description: `${transaction.currency === "USD" ? "$" : "៛"}${Number(
        transaction.amount || 0
      ).toLocaleString()} ${transaction.currency} ${
        transaction.type
      } completed for ${customerName} #${customerId}`,
      created_at: transaction.created_at,
      customer_id: transaction.customer_id,
    });
  });

  const recentCustomers = customers
    .sort(
      (a, b) =>
        new Date(b.created_at || b.joinDate) -
        new Date(a.created_at || a.joinDate)
    )
    .slice(0, 5);
  recentCustomers.forEach((customer) => {
    activities.push({
      id: activities.length + 1,
      type: "customer",
      title: "New customer registered",
      description: `${customer.name} created account #${customer.CustomerId}`,
      created_at: customer.created_at || customer.joinDate,
      customer_id: customer.id,
    });
  });

  const recentBanks = banks
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 2);
  recentBanks.forEach((bank) => {
    activities.push({
      id: activities.length + 1,
      type: "bank",
      title: "New bank partner added",
      description: `${bank.bank_name} integration completed successfully`,
      created_at: bank.created_at,
      bank_id: bank.id,
    });
  });

  return activities
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10);
};

export const dashboardAPI = {
  getOverview: async () => {
    const [customers, banks] = await Promise.all([
      customerAPI.getAll({ all_customers: true }),
      bankAPI.getAll(),
    ]);
    const customerData = customers.data || customers;
    const bankData = banks.data || banks;
    const metrics = calculateDashboardMetrics(customerData, bankData);
    const activities = generateRecentActivities(customerData, bankData);
    const monthlyStats = calculateMonthlyStats(customerData, bankData);

    return {
      metrics,
      activities,
      monthlyStats,
      transactions: customerData,
      banks: bankData,
    };
  },
};

export const getDashboardOverview = dashboardAPI.getOverview;
