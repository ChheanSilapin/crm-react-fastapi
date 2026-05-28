export const CURRENCY_SYMBOLS = { USD: '$', KHR: '៛' };

export const formatNumberWithCommas = (value, decimals = 2, forceDecimals = false) => {
  if (value === null || value === undefined || value === '') return '';
  const numValue = parseFloat(String(value).replace(/[^\d.-]/g, ''));
  if (isNaN(numValue)) return '';

  const options = {
    minimumFractionDigits: forceDecimals ? decimals : 0,
    maximumFractionDigits: decimals
  };

  return numValue.toLocaleString('en-US', options);
};

export const formatCurrency = (value, currency = 'USD', decimals = 2, forceDecimals = false) => {
  if (value === null || value === undefined || value === '') return '';
  const formattedNumber = formatNumberWithCommas(value, decimals, forceDecimals);
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  return `${symbol}${formattedNumber}`;
};


export const removeNumberFormatting = formattedValue => formattedValue?.toString().replace(/[^\d.-]/g, '') || '';

export const parseFormattedNumber = formattedValue => parseFloat(removeNumberFormatting(formattedValue)) || 0;

export const handleTypingInput = inputValue => {
  const cleanValue = inputValue.replace(/[^\d.-]/g, '');
  const parts = cleanValue.split('.');
  if (parts.length > 2) return `${parts[0]}.${parts.slice(1).join('')}`;
  const minusCount = (cleanValue.match(/-/g) || []).length;
  if (minusCount > 1) return cleanValue.replace(/-/g, '').replace(/^/, cleanValue.startsWith('-') ? '-' : '');
  return cleanValue;
};

export const formatWithCommasWhileTyping = (inputValue) => {
  const cleanValue = handleTypingInput(String(inputValue ?? ''));
  if (cleanValue === '' || cleanValue === '-' || cleanValue === '.') return cleanValue;

  const isNegative = cleanValue.startsWith('-');
  const unsigned = isNegative ? cleanValue.slice(1) : cleanValue;
  const hasDot = unsigned.includes('.');
  const endsWithDot = unsigned.endsWith('.');

  const [intPartRaw = '', fracPartRaw] = unsigned.split('.');
  const intWithCommas = intPartRaw.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  let result = (isNegative ? '-' : '') + intWithCommas;
  if (hasDot) {
    result += '.';
    if (!endsWithDot && typeof fracPartRaw === 'string') {
      result += fracPartRaw;
    }
  }
  return result;
};

export const getPlaceholder = (fieldType, currency = 'USD') => {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  return fieldType === 'amount' ? `${symbol}0.00` : '0.00';
};

export const formatFullDateTime = dateString => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  const timeString = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${month}/${day}/${year} ${timeString}`;
};

export const formatDateOnly = dateString => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};
