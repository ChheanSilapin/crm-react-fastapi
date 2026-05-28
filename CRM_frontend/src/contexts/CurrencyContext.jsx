import React, { createContext, useContext, useState, useEffect } from 'react';

// Configuration constants with hardcoded defaults
const DEFAULT_CURRENCY = 'USD';
const CURRENCY_STORAGE_KEY = 'currency';

const CurrencyContext = createContext();




const CURRENCIES = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rate: 1, 
  },
  KHR: {
    code: 'KHR',
    symbol: '៛',
    name: 'Cambodian Riel',
    rate: 4100, 
  },
};

export const CurrencyProvider = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState(() => {
    // Get saved currency from localStorage or default to configured default
    const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
    return saved && CURRENCIES[saved] ? saved : DEFAULT_CURRENCY;
  });

  useEffect(() => {
    // Save currency preference to localStorage
    localStorage.setItem(CURRENCY_STORAGE_KEY, currentCurrency);
  }, [currentCurrency]);

  const switchCurrency = (currencyCode) => {
    if (CURRENCIES[currencyCode]) {
      setCurrentCurrency(currencyCode);
    }
  };

  const formatAmount = (amount, currencyCode = currentCurrency) => {
    const currency = CURRENCIES[currencyCode];
    if (!currency) return amount;

    const options = currencyCode === 'KHR'
      ? { minimumFractionDigits: 0, maximumFractionDigits: 2 }
      : { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    const formatted = new Intl.NumberFormat('en-US', options).format(amount);

    return `${currency.symbol}${formatted}`;
  };

  const convertAmount = (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount;
    
    const from = CURRENCIES[fromCurrency];
    const to = CURRENCIES[toCurrency];
    
    if (!from || !to) return amount;

    // Convert to USD first, then to target currency
    const usdAmount = fromCurrency === 'USD' ? amount : amount / from.rate;
    return toCurrency === 'USD' ? usdAmount : usdAmount * to.rate;
  };

  const value = {
    currentCurrency,
    currencies: CURRENCIES,
    switchCurrency,
    formatAmount,
    convertAmount,
    getCurrencyInfo: (code) => CURRENCIES[code],
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Export the useCurrency hook
// eslint-disable-next-line react-refresh/only-export-components
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
