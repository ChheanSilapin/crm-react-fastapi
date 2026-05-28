import React, { useState, useEffect, useRef, Suspense } from "react";
import { useCurrency } from "../contexts/CurrencyContext";
import {
  UsersIcon,
  SearchIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
} from "../icons";
import { Filter } from "lucide-react";
import { useCustomers } from "../hooks/useCustomers";
import { formatFullDateTime } from "../utils/currencyFormatter";
import { usePermissions } from "../hooks/usePermissions";
import DateTimePicker from "../components/DateTimePicker";

const AddCustomerModal = React.lazy(() =>
  import("../components/modals/customers/AddCustomerModal")
);
const EditCustomerModal = React.lazy(() =>
  import("../components/modals/customers/EditCustomerModal")
);
const DeleteCustomerModal = React.lazy(() =>
  import("../components/modals/customers/DeleteCustomerModal")
);

const Customers = () => {
  const { formatAmount } = useCurrency();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [localCurrency, setLocalCurrency] = useState("All Currencies");
  const [dateFilter, setDateFilter] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [timeStart, setTimeStart] = useState(""); // e.g., "07:00"
  const [timeEnd, setTimeEnd] = useState("");   // e.g., "19:00"
  const [isModalOpen, setIsModalOpen] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isPerPageDropdownOpen, setIsPerPageDropdownOpen] = useState(false);
  const { useCRUDPermissions } = usePermissions();
  const { canCreate, canUpdate, canDelete } = useCRUDPermissions("customers");


  const {
    customers,
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
  } = useCustomers(
    currentPage,
    itemsPerPage,
    searchTerm,
    typeFilter,
    localCurrency,
    dateFilter,
    timeStart,
    timeEnd
  );

  const typeOptions = [
    { value: "All Types", label: "All Types" },
    { value: "Deposit", label: "Deposit" },
    { value: "Withdrawal", label: "Withdrawal" },
  ];
  const currencyOptions = [
    { value: "All Currencies", label: "All Currencies" },
    { value: "USD", label: "USD ($)" },
    { value: "KHR", label: "KHR (៛)" },
  ];

  const perPageOptions = [50, 100, 150];

  const filterDropdownRef = useRef(null);
  const perPageDropdownRef = useRef(null);

  const handlePageChange = (newPage) => setCurrentPage(newPage);
  const handlePerPageChange = (newPerPage) => {
    setItemsPerPage(newPerPage);
    setCurrentPage(1);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(e.target)
      )
        setIsFilterDropdownOpen(false);
      if (
        perPageDropdownRef.current &&
        !perPageDropdownRef.current.contains(e.target)
      )
        setIsPerPageDropdownOpen(false);
    };
    if (isFilterDropdownOpen || isPerPageDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterDropdownOpen, isPerPageDropdownOpen]);

  const filteredCustomers = (customers?.data || []).filter(
    (c) =>
      (c.customer_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.bank?.bank_name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (localCurrency === "All Currencies" || c.currency === localCurrency) &&
      (typeFilter === "All Types" || c.type === typeFilter)
  );

  // Determine if a meaningful filter is active (excluding default date)
  const hasActiveFilter =
    (localCurrency !== "All Currencies") ||
    (typeFilter !== "All Types") ||
    Boolean(timeStart) ||
    Boolean(timeEnd);

  // Compute totals that respect current filters
  const totals = React.useMemo(() => {
    const base = { usdAmount: 0, khrAmount: 0, totalCredit: 0 };
    const list = filteredCustomers;
    for (const c of list) {
      const amt = parseFloat(c.amount || 0) || 0;
      const credit = parseFloat(c.credit || 0) || 0;
      if (c.currency === 'USD') base.usdAmount += amt;
      else if (c.currency === 'KHR') base.khrAmount += amt;
      base.totalCredit += credit;
    }
    return base;
  }, [filteredCustomers]);

  const handleModal = (type, customer = null) => {
    if (type === "close") {
      setIsModalOpen({ add: false, edit: false, delete: false });
      setSelectedCustomer(null);
    } else {
      setIsModalOpen({
        add: type === "add",
        edit: type === "edit",
        delete: type === "delete",
      });
      setSelectedCustomer(customer);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (isModalOpen.add) await create(data);
      if (isModalOpen.edit) await update({ id: selectedCustomer.id, data });
      if (isModalOpen.delete) await deleteCustomer(data);
      handleModal("close");
    } catch (err) {
      console.error(`Failed to process request:`, err);
      throw err;
    }
  };


  const renderLoadingOrError = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Customer
        </h1>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-green-200 dark:border-blue-400 p-8 text-center">
        {loading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Loading customers...
            </span>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center gap-2">
            <div className="text-red-500 w-6 h-6">✕</div>
            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>
    </div>
  );

  if (loading || error) return renderLoadingOrError();

  const renderPaginationButton = (pageNum, isCurrent, onClick) => (
    <button
      key={pageNum}
      onClick={onClick}
      className={`w-8 h-8 text-sm rounded-lg flex items-center justify-center transition-colors ${isCurrent
        ? "bg-blue-600 text-white"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
        }`}
    >
      {pageNum}
    </button>
  );
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage customer accounts and information
          </p>
        </div>
        {canCreate && (
          <button
            onClick={() => handleModal("add")}
            disabled={isCreating}
            className="inline-flex items-center px-4 py-2 bg-green-900 hover:bg-green-300 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UsersIcon className="w-5 h-5 mr-2" />
            {isCreating ? "Adding..." : "Add Customer"}
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-green-200 dark:border-blue-400 p-4 sm:px-6 sm:py-4">
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
          <div className="relative w-auto min-w-0">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="w-4 h-4 text-green-400 dark:text-blue-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Customer_ID "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 pl-9 pr-3 py-2 border border-green-200 dark:border-blue-400 rounded-lg bg-white dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 text-sm focus:border-green-400 dark:focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div ref={filterDropdownRef} className="relative flex-shrink-0">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="h-9 px-3 py-2 rounded-lg text-sm font-medium shadow-theme-xs bg-white dark:bg-gray-900 border border-green-200 dark:border-blue-400 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <Filter className="w-4 h-4 text-green-400 dark:text-blue-400" />
              <span className="hidden sm:inline">Filter</span>
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform duration-200 ${isFilterDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>
            {isFilterDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-gray-900 border border-green-200 dark:border-blue-400 rounded-lg shadow-lg z-50 overflow-hidden transform -translate-x-4 sm:translate-x-0">
                <div className="flex items-center justify-between px-3 py-2 border-b border-green-200 dark:border-blue-400">
                  <h3 className="text-xs font-medium text-gray-900 dark:text-white">
                    Filters
                  </h3>
                  <button
                    onClick={() => setIsFilterDropdownOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Currency
                      </label>
                      <div className="space-y-0.5">
                        {currencyOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => { setLocalCurrency(option.value); setCurrentPage(1); }}
                            className={`w-full text-left px-2 py-1 rounded text-xs transition-colors flex items-center justify-between ${localCurrency === option.value
                              ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-medium"
                              : "text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-800"
                              }`}
                          >
                            <span className="truncate">{option.label}</span>
                            {localCurrency === option.value && <span>✓</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Type
                      </label>
                      <div className="space-y-0.5">
                        {typeOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => { setTypeFilter(option.value); setCurrentPage(1); }}
                            className={`w-full text-left px-2 py-1 rounded text-xs transition-colors flex items-center justify-between ${typeFilter === option.value
                              ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-medium"
                              : "text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-800"
                              }`}
                          >
                            <span className="truncate">{option.label}</span>
                            {typeFilter === option.value && <span>✓</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 mt-2 border-t border-green-200 dark:border-blue-400">
                    <button
                      onClick={() => {
                        setTypeFilter("All Types");
                        setLocalCurrency("All Currencies");
                        setTimeStart("");
                        setTimeEnd("");
                        setCurrentPage(1);
                        setIsFilterDropdownOpen(false);
                      }}
                      className="w-full text-center px-2 py-1 rounded text-xs text-gray-500 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-800 transition-colors"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DateTimePicker
            dateValue={dateFilter}
            onDateChange={(d) => { setDateFilter(d); setCurrentPage(1); }}
            timeStart={timeStart}
            timeEnd={timeEnd}
            onTimeStartChange={(t) => { setTimeStart(t); setCurrentPage(1); }}
            onTimeEndChange={(t) => { setTimeEnd(t); setCurrentPage(1); }}
            className="ml-auto"
          />
        </div>
      </div>

      {/* Conditional Rendering Block Starts Here */}
      {customers?.data && customers?.data.length > 0 ? (<>
        <div className="overflow-hidden rounded-xl border border-green-200 bg-white dark:border-blue-400 dark:bg-white/[0.03]">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="border-b border-green-200 dark:border-blue-400">
                <tr>
                  <th className="px-0.5 py-1 md:px-1 md:py-2 font-medium text-gray-500 text-center text-xs dark:text-gray-400">
                    #
                  </th>
                  <th className="px-0.5 py-1 md:px-1 md:py-2 font-medium text-gray-500 text-start text-sm dark:text-gray-400">
                    Customer
                  </th>
                  <th className="px-0.5 py-1 md:px-1 md:py-2 font-medium text-gray-500 text-center text-sm dark:text-gray-400">
                    Transaction
                  </th>
                  <th className="hidden md:table-cell px-0.5 py-1 md:px-1 md:py-2 font-medium text-gray-500 text-start text-sm dark:text-gray-400">
                    Bank
                  </th>
                  <th className="px-0.5 py-1 md:px-1 md:py-2 font-medium text-gray-500 text-end text-sm dark:text-gray-400">
                    Amount
                  </th>
                  <th className="hidden lg:table-cell px-0.5 py-1 md:px-1 md:py-2 font-medium text-gray-500 text-end text-sm dark:text-gray-400">
                    Credit
                  </th>
                  <th className="hidden sm:table-cell px-0.5 py-1 md:px-1 md:py-2 font-medium text-gray-500 text-center text-sm dark:text-gray-400">
                    Date
                  </th>
                  <th className="px-0.5 py-1 md:px-1 md:py-2 font-medium text-gray-500 text-center text-sm dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-200 dark:divide-blue-400">
                {filteredCustomers.map((c, i) => (
                  <tr
                    key={`${c.customer_id}-${i}`}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-0.5 py-1 md:px-1 md:py-2 text-center">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-0.5 py-1 md:px-1 md:py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 dark:text-blue-400 font-medium text-xs">
                            {(c.name && c.name.trim()
                              ? c.name
                              : c.customer_id
                            ).charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block font-medium text-gray-800 text-xs dark:text-white/90 truncate">
                            {c.customer_id}
                          </span>
                          {c.name && c.name.trim() && (
                            <span className="block text-gray-500 text-xs dark:text-gray-400 truncate">
                              {c.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-0.5 py-1 md:px-1 md:py-2 text-center">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex px-1.5 py-0.5 text-sm font-medium rounded-full ${c.type === "Deposit"
                            ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400"
                            : "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400"
                            }`}
                        >
                          {c.type}
                        </span>
                        <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 truncate">
                          {c.bank.bank_name}
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-0.5 py-1 md:px-1 md:py-2 text-gray-500 text-start text-sm dark:text-gray-400">
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white/90">
                          {c.bank.bank_name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {c.bank_id}
                        </div>
                      </div>
                    </td>
                    <td className="px-0.5 py-1 md:px-1 md:py-2 text-end text-gray-500 text-sm dark:text-gray-400">
                      <div className="space-y-1">
                        <span className="block font-medium text-gray-800 dark:text-white/90">
                          {formatAmount(c.amount, c.currency)}
                        </span>
                        <div className="lg:hidden text-sm text-gray-500 dark:text-gray-400">
                          Credit: {Number(c.credit).toLocaleString("en-US")}
                        </div>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-0.5 py-1 md:px-1 md:py-2 text-end text-gray-500 text-xs dark:text-gray-400">
                      <span className="font-medium text-gray-800 dark:text-white/90">
                        {Number(c.credit).toLocaleString("en-US")}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-0.5 py-1 md:px-1 md:py-2 text-center text-gray-500 text-sm dark:text-gray-400">
                      {formatFullDateTime(c.create_at)}
                    </td>
                    <td className="px-0.5 py-1 md:px-1 md:py-2 text-center">
                      <div className="flex justify-center space-x-1">
                        {canUpdate && (
                          <button
                            onClick={() => handleModal("edit", c)}
                            disabled={isUpdating || isDeleting}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 disabled:text-gray-400 disabled:cursor-not-allowed p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                            title="Edit Customer"
                          >
                            <PencilIcon className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleModal("delete", c)}
                            disabled={isUpdating || isDeleting}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 disabled:text-gray-400 disabled:cursor-not-allowed p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            title="Delete Customer"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals (shown when filters active) under the table */}
        {hasActiveFilter && (
          <div className="mt-3 bg-white dark:bg-gray-900 rounded-xl border border-green-200 dark:border-blue-400 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">Totals for current filters</div>
              <div className="flex flex-wrap gap-3 text-sm">
                {localCurrency === 'All Currencies' ? (
                  <>
                    <span className="px-2 py-1 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                      USD Amount: {Number(totals.usdAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="px-2 py-1 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                      KHR Amount: {Number(totals.khrAmount).toLocaleString('en-US')}
                    </span>
                  </>
                ) : (
                  <span className="px-2 py-1 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                    Total Amount ({localCurrency}): {localCurrency === 'USD' ? Number(totals.usdAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : Number(totals.khrAmount).toLocaleString('en-US')}
                  </span>
                )}
                <span className="px-2 py-1 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                  Total Credit: {Number(totals.totalCredit).toLocaleString('en-US')}
                </span>
              </div>
            </div>
          </div>
        )}

        {pagination && pagination.total > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-green-200 dark:border-blue-400 p-4">
            <div className="flex items-center justify-between">
              <div className="hidden sm:block text-sm text-gray-600 dark:text-gray-400">
                Showing {pagination.from || 1} to{" "}
                {pagination.to || customers.length} of{" "}
                {pagination.total || customers.length} customers
              </div>
              <div className="sm:hidden"></div>
              <div className="flex items-center gap-1">
                {pagination.last_page > 1 && (
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="w-8 h-8 text-sm rounded-lg flex items-center justify-center transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ‹
                  </button>
                )}
                {pagination.last_page &&
                  Array.from(
                    { length: Math.min(pagination.last_page, 5) },
                    (_, i) => {
                      const pageNum =
                        pagination.last_page <= 5
                          ? i + 1
                          : Math.max(1, currentPage - 2) + i;
                      if (
                        pageNum >
                        Math.min(
                          pagination.last_page,
                          Math.max(1, currentPage - 2) + 4
                        )
                      )
                        return null;
                      return renderPaginationButton(
                        pageNum,
                        pageNum === currentPage,
                        () => handlePageChange(pageNum)
                      );
                    }
                  )}
                {pagination.last_page > 1 && (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= pagination.last_page}
                    className="w-8 h-8 text-sm rounded-lg flex items-center justify-center transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ›
                  </button>
                )}
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Per page:
                </span>
                <div ref={perPageDropdownRef} className="relative">
                  <button
                    onClick={() =>
                      setIsPerPageDropdownOpen(!isPerPageDropdownOpen)
                    }
                    className="h-8 px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap"
                  >
                    <span>{itemsPerPage}</span>
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform duration-200 ${isPerPageDropdownOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {isPerPageDropdownOpen && (
                    <div className="absolute bottom-full right-0 mb-2 w-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-[80] overflow-hidden">
                      {perPageOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            handlePerPageChange(option);
                            setIsPerPageDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-sm transition-colors duration-200 flex items-center justify-between ${itemsPerPage === option
                            ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                        >
                          <span>{option}</span>
                          {itemsPerPage === option && <span>✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="sm:hidden"></div>
            </div>
          </div>
        )}
      </>) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-green-200 dark:border-blue-400 p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {customers?.message || "No customer created for Today."}
          </p>
        </div>
      )}

      <Suspense fallback={<div>Loading...</div>}>
        {isModalOpen.add && (
          <AddCustomerModal
            isOpen={isModalOpen.add}
            onClose={() => handleModal("close")}
            onSubmit={handleSubmit}
            isLoading={isCreating}
          />
        )}
        {isModalOpen.edit && (
          <EditCustomerModal
            isOpen={isModalOpen.edit}
            onClose={() => handleModal("close")}
            onSubmit={handleSubmit}
            customer={selectedCustomer}
            isLoading={isUpdating}
          />
        )}
        {isModalOpen.delete && (
          <DeleteCustomerModal
            isOpen={isModalOpen.delete}
            onClose={() => handleModal("close")}
            onConfirm={handleSubmit}
            customer={selectedCustomer}
            isLoading={isDeleting}
          />
        )}
      </Suspense>
    </div>
  );
};

export default Customers;