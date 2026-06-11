import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker24h } from "@/components/ui/date-time-picker";

export function CustomerFilters({ children }) {
  const [datePreset, setDatePreset] = useState("today"); // "today", "all_time", "custom"
  const [txnType, setTxnType] = useState("all"); // "all", "deposit", "withdrawal"
  const [currency, setCurrency] = useState("all");
  const [dateFilter, setDateFilter] = useState("today");

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Search Input passed as children */}
          {children}

          {/* Date Preset Group */}
          <div className="flex items-center rounded-md p-1 bg-muted/20 gap-2">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this_week">This week</SelectItem>
                <SelectItem value="this_month">This month</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
              </SelectContent>
            </Select>

            <Select value={txnType} onValueChange={setTxnType}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="deposit">Deposit</SelectItem>
                <SelectItem value="withdrawal">Withdrawal</SelectItem>
              </SelectContent>
            </Select>

            {/* Currency Dropdown */}

            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="all">All Currencies</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="KHR">KHR</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={datePreset === "custom" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setDatePreset("custom")}
            >
              Custom Date...
            </Button>
          </div>
        </div>
      </div>

      {/* Conditional Date & Time Pickers */}
      {datePreset === "custom" && (
        <div className="flex flex-wrap items-center gap-4 p-4 border rounded-md bg-muted/10 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Start Date
            </label>
            <DateTimePicker24h
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              End Date
            </label>
            <DateTimePicker24h
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
