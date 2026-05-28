import React, { useState, useRef, useEffect } from "react";
import { CalendarIcon, ChevronDownIcon } from "../icons";

const DatePicker = ({ value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedPreset, setSelectedPreset] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleClosePopovers = (e) => { if (e?.detail?.source !== 'date') setIsOpen(false); };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    window.addEventListener('close-popovers', handleClosePopovers);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener('close-popovers', handleClosePopovers);
    };
  }, [isOpen]);

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "Select Date";
    if (dateStr === "all_customers") return "All customers";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const presetOptions = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "all", label: "All customers" },
  ];

  const getDateFromPreset = (preset) => {
    const today = new Date();
    switch (preset) {
      case "today":
        return today.toISOString().split('T')[0];
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
      default:
        return today.toISOString().split('T')[0];
    }
  };

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
    if (preset === "today" || preset === "yesterday") {
      const dateValue = getDateFromPreset(preset);
      onChange(dateValue);
    } else if (preset === "all") {
      onChange("all_customers");
    }
    setIsOpen(false);
  };

  const handleDateSelect = (selectedValue) => {
    onChange(selectedValue);
    setSelectedPreset("");
    setIsOpen(false);
  };

  const handleClear = () => {
    const today = new Date().toISOString().split('T')[0];
    onChange(today);
    setSelectedPreset("");
    setIsOpen(false);
  };

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const isDateSelected = (day) => {
    if (!day || !value) return false;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr === value;
  };

  const handleMonthChange = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const calendarDays = generateCalendarDays();

  return (
    <div ref={dropdownRef} className={`relative flex-shrink-0 ${className}`}>
      <button
        onClick={() => { window.dispatchEvent(new CustomEvent('close-popovers', { detail: { source: 'date' } })); setIsOpen(!isOpen); }}
        className="h-9 pl-9 pr-3 py-2 border border-green-200 dark:border-blue-400 rounded-lg bg-white dark:bg-gray-900 dark:text-white text-sm focus:border-green-400 dark:focus:border-blue-500 focus:outline-none hover:bg-green-50 dark:hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap min-w-[140px]"
      >
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <CalendarIcon className="w-4 h-4 text-green-400 dark:text-blue-400" />
        </div>
        <span className="truncate">{formatDateDisplay(value)}</span>
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-green-200 dark:border-blue-400 rounded-lg shadow-lg z-[90] overflow-visible">
          <div className="flex items-center justify-between px-3 py-2 border-b border-green-200 dark:border-blue-400">
            <h3 className="text-xs font-medium text-gray-900 dark:text-white">
              Select Date
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="flex">
            {/* Left side - Preset options */}
            <div className="w-36 border-r border-green-200 dark:border-blue-400 p-2">
              <div className="space-y-1">
                {presetOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-green-50 dark:hover:bg-green-800 px-1 py-0.5 rounded"
                  >
                    <input
                      type="radio"
                      name="datePreset"
                      value={option.value}
                      checked={selectedPreset === option.value}
                      onChange={() => handlePresetSelect(option.value)}
                      className="w-3 h-3 text-green-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 focus:ring-green-500 dark:focus:ring-blue-400"
                    />
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Right side - Calendar */}
            <div className="flex-1 p-2">
              {/* Month/Year navigation */}
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => handleMonthChange('prev')}
                  className="p-0.5 hover:bg-green-50 dark:hover:bg-green-800 rounded transition-colors"
                >
                  <ChevronDownIcon className="w-3 h-3 rotate-90 text-gray-600 dark:text-gray-400" />
                </button>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium text-gray-900 dark:text-white px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                    {monthNames[currentMonth]}
                  </span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                    {currentYear}
                  </span>
                </div>
                <button
                  onClick={() => handleMonthChange('next')}
                  className="p-0.5 hover:bg-green-50 dark:hover:bg-green-800 rounded transition-colors"
                >
                  <ChevronDownIcon className="w-3 h-3 -rotate-90 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-0.5 text-center">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-xs font-medium text-gray-500 dark:text-gray-400 py-0.5">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (day) {
                        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        handleDateSelect(dateStr);
                      }
                    }}
                    disabled={!day}
                    className={`w-6 h-6 text-xs rounded transition-colors ${
                      !day 
                        ? 'invisible' 
                        : isDateSelected(day)
                        ? 'bg-green-600 dark:bg-blue-600 text-white font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-800'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-green-200 dark:border-blue-400 p-2">
            <button
              onClick={handleClear}
              className="w-full text-center px-2 py-1 rounded text-xs text-gray-500 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-800 transition-colors"
            >
              Clear date filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
