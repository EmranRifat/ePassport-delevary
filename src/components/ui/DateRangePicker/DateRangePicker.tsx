"use client";

import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

type Range = {
  startDate: Date | null;
  endDate: Date | null;
};

const addMonths = (date: Date, count: number) =>
  new Date(date.getFullYear(), date.getMonth() + count, 1);

const isSameDay = (a?: Date | null, b?: Date | null) =>
  a && b && a.toDateString() === b.toDateString();

const IndependentMonthRangePicker = () => {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<Range>({
    startDate: null,
    endDate: null,
  });

  const [leftMonth, setLeftMonth] = useState(new Date());
  const [rightMonth, setRightMonth] = useState(addMonths(new Date(), 1));

  const format = (date: Date | null) =>
    date ? date.toLocaleDateString("en-GB") : "";

  const isInRange = (date: Date) => {
    if (!range.startDate || !range.endDate) return false;
    return date > range.startDate && date < range.endDate;
  };

  const handleSelect = (date: Date) => {
    if (!range.startDate || range.endDate) {
      setRange({ startDate: date, endDate: null });
    } else if (date >= range.startDate) {
      setRange({ ...range, endDate: date });
      setOpen(false);
    } else {
      setRange({ startDate: date, endDate: null });
    }
  };

  const renderMonth = (
    monthDate: Date,
    onPrev: () => void,
    onNext: () => void
  ) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return (
      <div>
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={onPrev}
            className="rounded-lg p-1 text-gray-600 hover:bg-gray-100
                       dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <ChevronLeft size={16} />
          </button>

          <p className="font-medium text-gray-800 dark:text-neutral-200">
            {monthDate.toLocaleString("default", { month: "long" })} {year}
          </p>

          <button
            onClick={onNext}
            className="rounded-lg p-1 text-gray-600 hover:bg-gray-100
                       dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const date = new Date(year, month, day);

            const selected =
              isSameDay(date, range.startDate) ||
              isSameDay(date, range.endDate);

            return (
              <button
                key={day}
                onClick={() => handleSelect(date)}
                className={`
                  h-9 rounded-lg transition
                  ${
                    selected
                      ? "bg-gray-800 text-white dark:bg-white dark:text-black"
                      : isInRange(date)
                      ? "bg-gray-200 dark:bg-neutral-700"
                      : "hover:bg-gray-100 dark:hover:bg-neutral-800"
                  }
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-[360px]">
      {/* Input */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-xl border px-4 py-3 text-sm shadow-sm
                   bg-white dark:bg-gray-800
                   border-gray-200 dark:border-neutral-700
                   text-gray-700 dark:text-neutral-200
                   hover:border-gray-400 dark:hover:border-neutral-500"
      >
        <CalendarDays size={18} />
        <span>
          {range.startDate
            ? `${format(range.startDate)} → ${format(range.endDate)}`
            : "Select date range"}
        </span>
      </button>

      {/* Popover */}
      {open && (
        <div
          className="absolute z-50 mt-2 w-[720px] rounded-2xl border p-5
                     bg-white dark:bg-gray-800
                     border-gray-200 dark:border-neutral-700
                     shadow-xl dark:shadow-black/40"
        >
          <div className="grid grid-cols-2 gap-8">
            {renderMonth(
              leftMonth,
              () => setLeftMonth(addMonths(leftMonth, -1)),
              () => setLeftMonth(addMonths(leftMonth, 1))
            )}

            {renderMonth(
              rightMonth,
              () => setRightMonth(addMonths(rightMonth, -1)),
              () => setRightMonth(addMonths(rightMonth, 1))
            )}
          </div>

          <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-neutral-400">
            <span>Start date</span>
            <span>End date</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndependentMonthRangePicker;
