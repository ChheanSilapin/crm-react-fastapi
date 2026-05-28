import React, { useEffect, useMemo, useRef, useState } from "react";
import DatePicker from "./DatePicker";

const to12h = (hhmm) => {
  const [hStr, mStr] = (hhmm || '00:00').split(':');
  let h = parseInt(hStr, 10);
  const m = mStr.padStart(2, '0');
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${String(h).padStart(2, '0')}:${m} ${period}`;
};

const formatTimeRangeLabel = (from, to) => {
  if (!from && !to) return "All day";
  const f = from || "00:00";
  const t = to || "23:59";
  return `${to12h(f)} ${to12h(t)}`;
};

const DateTimePicker = ({
  dateValue,
  onDateChange,
  timeStart,
  timeEnd,
  onTimeStartChange,
  onTimeEndChange,
  className = "",
}) => {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [localStart, setLocalStart] = useState(timeStart || "");
  const [localEnd, setLocalEnd] = useState(timeEnd || "");

  useEffect(() => {
    setLocalStart(timeStart || "");
  }, [timeStart]);
  useEffect(() => {
    setLocalEnd(timeEnd || "");
  }, [timeEnd]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleClosePopovers = (e) => {
      if (e?.detail?.source !== 'time') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    window.addEventListener('close-popovers', handleClosePopovers);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener('close-popovers', handleClosePopovers);
    };
  }, [isOpen]);

  const buttonLabel = useMemo(() => formatTimeRangeLabel(timeStart, timeEnd), [timeStart, timeEnd]);

  const handleClear = () => {
    setLocalStart("");
    setLocalEnd("");
    if (onTimeStartChange) onTimeStartChange("");
    if (onTimeEndChange) onTimeEndChange("");
    setIsOpen(false);
  };

  return (
    <div className={`relative flex flex-wrap items-center gap-2 ${className}`} ref={dropdownRef}>
      {/* Date button reuses existing DatePicker behavior */}
      <div className="relative z-[50]">
        <DatePicker value={dateValue} onChange={onDateChange} />
      </div>

      {/* Time button opens a compact two-column pane */}
      <button
        type="button"
        onClick={() => {
          window.dispatchEvent(new CustomEvent('close-popovers', { detail: { source: 'time' } }));
          setIsOpen((v) => !v);
        }}
        className="h-9 pl-3 pr-3 py-2 border border-green-200 dark:border-blue-400 rounded-lg bg-white dark:bg-gray-900 dark:text-white text-sm focus:border-green-400 dark:focus:border-blue-500 focus:outline-none hover:bg-green-50 dark:hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap min-w-[140px]"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span className="truncate">{buttonLabel}</span>
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" /></svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[420px] bg-white dark:bg-gray-900 border border-green-200 dark:border-blue-400 rounded-lg shadow-lg z-[100] overflow-visible">
          <div className="flex items-center justify-between px-3 py-2 border-b border-green-200 dark:border-blue-400">
            <h3 className="text-xs font-medium text-gray-900 dark:text-white">Select Time</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">✕</button>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-2 gap-6">
              <HourMinuteSelect
                label="From"
                value={localStart}
                onChange={(val) => {
                  // Enforce same-day range: if end < start, snap end to start
                  const end = localEnd || "";
                  setLocalStart(val);
                  if (onTimeStartChange) onTimeStartChange(val);
                  if (end && compareTimes(end, val) < 0) {
                    setLocalEnd(val);
                    if (onTimeEndChange) onTimeEndChange(val);
                  }
                }}
              />
              <HourMinuteSelect
                label="To"
                value={localEnd}
                onChange={(val) => {
                  // Prevent end < start by snapping to start
                  const start = localStart || "";
                  let next = val;
                  if (start && compareTimes(val, start) < 0) next = start;
                  setLocalEnd(next);
                  if (onTimeEndChange) onTimeEndChange(next);
                }}
              />
            </div>
            <div className="flex items-center justify-end gap-2 mt-3">
              <button type="button" onClick={handleClear} className="px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Clear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable hour+minute select pair, renders [HH ▼] [MM ▼]
const HourMinuteSelect = ({ label, value, onChange }) => {
  const hh = (value || '00:00').split(':')[0];
  const mm = (value || '00:00').split(':')[1];
  const onHour = (h) => onChange(`${h}:${mm}`);
  const onMinute = (m) => onChange(`${hh}:${m}`);
  const hourOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const hourLabel = (h) => {
    const n = parseInt(h, 10);
    const period = n >= 12 ? 'PM' : 'AM';
    let hr = n % 12;
    if (hr === 0) hr = 12;
    return `${hr} ${period}`;
  };
  return (
    <div>
      <div className="mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">{label}</div>
      <div className="flex items-center gap-2">
        <CompactSelect value={hh} onChange={onHour} options={hourOptions} widthClass="w-20" labelRenderer={hourLabel} />
        <CompactSelect value={mm} onChange={onMinute} options={Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))} widthClass="w-20" />
      </div>
    </div>
  );
};

// Compact single dropdown used by HourMinuteSelect
const CompactSelect = ({ value, onChange, options, widthClass = 'w-32', labelRenderer }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const f = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    if (open) document.addEventListener('mousedown', f);
    const closeAll = () => setOpen(false);
    window.addEventListener('close-popovers', closeAll);
    return () => {
      document.removeEventListener('mousedown', f);
      window.removeEventListener('close-popovers', closeAll);
    };
  }, [open]);

  return (
    <div className={`relative ${widthClass}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full h-9 px-3 bg-white dark:bg-gray-900 border border-green-200 dark:border-blue-400 rounded-lg text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between hover:bg-green-50 dark:hover:bg-gray-800"
      >
        <span>{labelRenderer ? labelRenderer(value) : value}</span>
        <svg className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" /></svg>
      </button>
      {open && (
        <div className="absolute z-[110] mt-2 w-full max-h-56 overflow-y-auto tp-scroll bg-white dark:bg-gray-900 border border-green-200 dark:border-blue-400 rounded-lg shadow-lg">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-xs ${value === opt ? 'bg-green-600 dark:bg-blue-600 text-white' : 'hover:bg-green-50 dark:hover:bg-green-800 text-gray-700 dark:text-gray-300'}`}
            >
              {labelRenderer ? labelRenderer(opt) : opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Compare HH:MM strings; returns negative if a < b, 0 if equal, positive if a > b
const compareTimes = (a, b) => {
  const [ah, am] = (a || '00:00').split(':').map(Number);
  const [bh, bm] = (b || '00:00').split(':').map(Number);
  return (ah * 60 + am) - (bh * 60 + bm);
};

export default DateTimePicker;

