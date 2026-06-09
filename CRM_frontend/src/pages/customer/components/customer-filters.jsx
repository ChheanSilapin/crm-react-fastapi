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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { PlusCircleIcon } from "lucide-react";

export function CustomerFilters({ children }) {
  const [datePreset, setDatePreset] = useState("today"); // "today", "all_time", "custom"
  const [txnType, setTxnType] = useState("all"); // "all", "deposit", "withdrawal"
  const [currency, setCurrency] = useState("all");

  const [customDate, setCustomDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleDateChange = (e) => {
    setCustomDate(e.target.value);
    setDatePreset("custom"); // Automatically switch to custom
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Search Input passed as children */}
          {children}

          {/* Date Preset Group */}
          <div className="flex items-center rounded-md p-1 bg-muted/20">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-dashed"
                >
                  <PlusCircleIcon className="mr-2 h-4 w-4" />
                  Date filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      <CommandItem>
                        <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary">
                          {/* Unchecked state */}
                        </div>
                        <span>Active</span>
                      </CommandItem>
                      <CommandItem>
                        <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary opacity-50"></div>
                        <span>Inactive</span>
                      </CommandItem>
                      <CommandItem>
                        <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary opacity-50"></div>
                        <span>Invited</span>
                      </CommandItem>
                      <CommandItem>
                        <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary opacity-50"></div>
                        <span>Suspended</span>
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button
              variant={datePreset === "all_time" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => {
                setDatePreset("all_time");
                setCustomDate("");
                setStartTime("");
                setEndTime("");
              }}
            >
              All Time
            </Button>
            <Button
              variant={datePreset === "custom" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setDatePreset("custom")}
            >
              Custom Date...
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Transaction Type Filter */}
          <div className="flex items-center rounded-md p-1 bg-muted/20">
            <Button
              variant={txnType === "all" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTxnType("all")}
            >
              All
            </Button>
            <Button
              variant={txnType === "deposit" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTxnType("deposit")}
            >
              Deposit
            </Button>
            <Button
              variant={txnType === "withdrawal" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTxnType("withdrawal")}
            >
              Withdrawal
            </Button>
            {/* Currency Dropdown */}
            <div className="w-[120px]">
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
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Date & Time Pickers */}
      {datePreset === "custom" && (
        <div className="flex flex-wrap items-center gap-4 p-4 border rounded-md bg-muted/10 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Date
            </label>
            <Input
              type="date"
              className="h-9"
              value={customDate}
              onChange={handleDateChange}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Start Time
            </label>
            <Input
              type="time"
              className="h-9"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              End Time
            </label>
            <Input
              type="time"
              className="h-9"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
