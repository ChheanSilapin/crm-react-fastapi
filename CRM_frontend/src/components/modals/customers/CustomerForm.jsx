import { useRef, useEffect } from 'react';
import { ChevronDownIcon, mergeClasses } from '../../../icons';
import { CURRENCY_SYMBOLS } from '../../../utils/currencyFormatter';

const CustomerForm = ({
  formData,
  displayValues,
  errors,
  dropdowns,
  banksLoading,
  getBankOptions,
  getBankById,
  handleInputChange,
  handleNumberInput,
  handleCurrencyChange,
  toggleDropdown,
  closeAllDropdowns,
  onSubmit
}) => {
  const typeDropdownRef = useRef(null);
  const currencyDropdownRef = useRef(null);
  const bankDropdownRef = useRef(null);

  const inputBaseClasses = "w-full px-2 py-1.5 sm:px-3 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400 transition-colors";

  useEffect(() => {
    const handleClickOutside = e => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target) &&
        currencyDropdownRef.current && !currencyDropdownRef.current.contains(e.target) &&
        bankDropdownRef.current && !bankDropdownRef.current.contains(e.target)) {
        closeAllDropdowns();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeAllDropdowns]);

  return (
    <form id="customer-form" onSubmit={onSubmit} autoComplete="off" className="space-y-3 sm:space-y-4 md:space-y-5">
      <div>
        <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">Customer ID *</label>
        <input
          type="text"
          name="customer_id"
          value={formData.customer_id}
          onChange={handleInputChange}
          required
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          className={mergeClasses(inputBaseClasses, errors.customer_id ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : '')}
          placeholder="e.g., CUST-001, CUST 002"
        />
        {errors.customer_id && (<p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.customer_id}</p>)}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
        <div className="relative" ref={typeDropdownRef}>
          <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">Type *</label>
          <button
            type="button"
            onClick={() => toggleDropdown('type')}
            className={mergeClasses(inputBaseClasses, 'flex items-center justify-between', errors.type ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : '')}
          >
            <span className={formData.type ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>{formData.type || 'Select type'}</span>
            <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${dropdowns.type ? 'rotate-180' : ''}`} />
          </button>
          {dropdowns.type && (<div className="absolute z-50 w-full mt-0.5 sm:mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-32 sm:max-h-40 overflow-y-auto">
            {['Deposit', 'Withdrawal'].map(type => (<button key={type} type="button" onClick={() => { handleInputChange({ target: { name: 'type', value: type } }); toggleDropdown('type'); }} className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-left text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white first:rounded-t-lg last:rounded-b-lg">{type}</button>))}
          </div>)}
          {errors.type && (<p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.type}</p>)}
        </div>

        <div className="relative" ref={currencyDropdownRef}>
          <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">Currency *</label>
          <button
            type="button"
            onClick={() => toggleDropdown('currency')}
            className={mergeClasses(inputBaseClasses, 'flex items-center justify-between', errors.currency ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : '')}
          >
            <span className="text-gray-900 dark:text-white">{CURRENCY_SYMBOLS[formData.currency]} {formData.currency}</span>
            <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${dropdowns.currency ? 'rotate-180' : ''}`} />
          </button>
          {dropdowns.currency && (<div className="absolute z-50 w-full mt-0.5 sm:mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
            {Object.entries(CURRENCY_SYMBOLS).map(([code, symbol]) => (<button key={code} type="button" onClick={() => handleCurrencyChange(code)} className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-left text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white first:rounded-t-lg last:rounded-b-lg">{symbol} {code}</button>))}
          </div>)}
          {errors.currency && (<p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.currency}</p>)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
        <div>
          <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">Credit *</label>
          <input
            type="text"
            name="credit"
            value={displayValues?.credit ?? formData.credit ?? ''}
            onChange={(e) => handleNumberInput(e, 'credit')}
            required
            autoComplete="off"
            className={mergeClasses(inputBaseClasses, errors.credit ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : '')}
            placeholder="0"
          />

          {errors.credit && (<p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.credit}</p>)}
        </div>
        <div>
          <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">Amount *</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
              {CURRENCY_SYMBOLS[formData.currency]}
            </span>
            <input
              type="text"
              name="amount"
              value={displayValues?.amount ?? formData.amount ?? ''}
              onChange={(e) => handleNumberInput(e, 'amount')}
              required
              autoComplete="off"
              className={mergeClasses(inputBaseClasses, 'pl-5 sm:pl-6', errors.amount ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : '')}
              placeholder={`0`}
            />
          </div>

          {errors.amount && (<p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.amount}</p>)}
        </div>
      </div>

      <div className="relative" ref={bankDropdownRef}>
        <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">Bank *</label>
        <button
          type="button"
          onClick={() => toggleDropdown('bank')}
          disabled={banksLoading}
          className={mergeClasses(inputBaseClasses, 'flex items-center justify-between', errors.bank_id ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : '', banksLoading ? 'opacity-50 cursor-not-allowed' : '')}
        >
          <span className={formData.bank_id ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>{formData.bank_id ? getBankById(formData.bank_id)?.bank_name || 'Select bank' : 'Select bank'}</span>
          <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${dropdowns.bank ? 'rotate-180' : ''}`} />
        </button>
        {dropdowns.bank && !banksLoading && (
          <div className="absolute z-50 w-full mt-0.5 sm:mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-40 sm:max-h-48 overflow-y-auto">
            <div className="grid grid-cols-5 gap-1 p-1.5">
              {getBankOptions().map(bank => (<button key={bank.value} type="button" onClick={() => { handleInputChange({ target: { name: 'bank_id', value: bank.value } }); toggleDropdown('bank'); }} className="flex flex-col items-center justify-center p-1.5 text-center text-xs hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-md border border-gray-100 dark:border-gray-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500/20 transition-colors min-h-[45px]" title={`${bank.label} (${bank.bank_code})`}>{bank.icon_logo ? (<img src={bank.icon_logo} alt={`${bank.label} logo`} className="w-4 h-4 object-contain mb-1" onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />) : null}<div className="w-4 h-4 bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center mb-1" style={{ display: bank.icon_logo ? 'none' : 'flex' }}><span className="text-xs font-bold text-gray-600 dark:text-gray-300">{bank.label.charAt(0)}</span></div><div className="font-medium text-xs leading-tight truncate w-full">{bank.label}</div></button>))}
            </div>
          </div>
        )}
        {errors.bank_id && (<p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.bank_id}</p>)}
      </div>

      <div>
        <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">Note</label>
        <textarea
          name="note"
          value={formData.note}
          onChange={handleInputChange}
          rows={2}
          autoComplete="off"
          className={mergeClasses(inputBaseClasses, 'resize-none sm:rows-3')}
          placeholder="Primary checking account."
        />
      </div>
    </form>
  );
};

export default CustomerForm;