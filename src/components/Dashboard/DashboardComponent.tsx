"use client";

import { useState, useEffect, useRef } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
// import { Button, LoadingSpinner, Input } from "@/components/ui";

import { useGetAllBookings } from "@/lib/hooks/useGetAllBookings";
import Cookies from "js-cookie";
import { AllBookingResponse } from "@/lib/types";
import {
  Button,
  DateRangePicker,
  Input,
  Pagination,
  RangeValue,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import renderCell from "./renderCell";
import { CalendarDate, parseDate } from "@internationalized/date";
const columns = [
  {
    name: "Serial No",
    uid: "serial_no",
  },
  {
    name: "Date",
    uid: "date",
  },
  {
    name: "Booking ID",
    uid: "booking_id",
  },
  {
    name: "RPO ID",
    uid: "rpo_id",
  },
  {
    name: "RPO Name",
    uid: "rpo_name",
  },
  {
    name: "Status",
    uid: "status",
  },
];

const DashboardComponent = () => {
  //   const router = useRouter();
  //   const { user, clearAuth } = useAuthStore();
  const token = Cookies.get("auth-token");

  // Initialize date range (last 30 days)
  const getDefaultDates = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const formatForInput = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    return {
      start: formatForInput(startDate),
      end: formatForInput(endDate),
    };
  };

  const defaultDates = getDefaultDates();

  const [dashboardData, setDashboardData] = useState<AllBookingResponse | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Booked" | "Delivered"
  >("All");
  // DateRangePicker state (CalendarDate)
  const [bookedDateRange, setBookedDateRange] = useState<
    RangeValue<CalendarDate>
  >({
    start: parseDate(defaultDates.start),
    end: parseDate(defaultDates.end),
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);

  const { getAllBookings, loading, error, data } = useGetAllBookings({ token });

  console.log("Getting_All_booking_Data==>", data);
  // Use ref to prevent multiple API calls on mount
  const hasFetchedRef = useRef(false);

  // Helper function to format date from YYYY-MM-DD to DD-MM-YYYY
  const formatDateForAPI = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  // Fetch bookings function
  const fetchBookings = async () => {
    if (!token) {
      console.log("No token available");
      return;
    }

    try {
      const userId = Cookies.get("user_id") || "";

      const requestData = {
        user_id: userId,
        start_date: formatDateForAPI(startDate),
        end_date: formatDateForAPI(endDate),
        page_no: currentPage,
        par_page_data: pageSize,
        status: statusFilter,
        ...(searchTerm && {
          rpo_code: searchTerm,
          rpo_name: searchTerm,
          barcode: searchTerm,
        }),
      };

      console.log("Fetching bookings with:", requestData);
      const response = await getAllBookings(requestData);
      setDashboardData(response);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  // Fetch bookings when component mounts or filters change
  useEffect(() => {
    // Skip the first render to avoid double calls in development mode
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchBookings();
      return;
    }

    fetchBookings();
  }, [currentPage, pageSize, statusFilter, startDate, endDate]); // eslint-disable-line react-hooks/exhaustive-deps

  // Date range picker handler: keep picker and API dates in sync
  const handleBookedDateRange = (value: RangeValue<CalendarDate> | null) => {
    if (!value) return;
    setBookedDateRange(value);
    const toYMD = (d: CalendarDate) => {
      const y = d.year;
      const m = String(d.month).padStart(2, "0");
      const dd = String(d.day).padStart(2, "0");
      return `${y}-${m}-${dd}`;
    };
    setStartDate(toYMD(value.start));
    setEndDate(toYMD(value.end));
  };

  // Handle search button click
  const handleSearch = () => {
    setCurrentPage(1);
    // Force a re-fetch by calling fetchBookings directly
    fetchBookings();
  };

  const totalPages = dashboardData?.total_page || 1;
  const passportData = dashboardData?.passportissuedata || [];
  const totalBooked = dashboardData?.total_booked?.toString() || "0";
  const totalDelivered = dashboardData?.total_delivered?.toString() || "0";

  // Show error message if there's an error
  if (error) {
    console.error("API Error:", error);
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-800/50 rounded-md">
      <div className="flex-1 flex flex-col">
        {/* Main Content */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              Dashboard
            </h2>
          </div>

          {/* Summary Statistics - Top Section */}
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Booked Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                    Booked
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {totalBooked}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivered Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                    Delivered
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {totalDelivered}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* All Filters Section */}
          <div className="mb-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Filters
            </h3>

            {/* Date Range Picker */}
            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex-1 max-w-md">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date Range
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="flex-1 text-sm border-none focus:outline-none focus:ring-0 p-0 bg-transparent dark:text-gray-200 dark:color-scheme-dark"
                      max={endDate}
                    />
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      to
                    </span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="flex-1 text-sm border-none focus:outline-none focus:ring-0 p-0 bg-transparent dark:text-gray-200 dark:color-scheme-dark"
                      min={startDate}
                    />
                  </div>
                  <DateRangePicker
                    size="md"
                    label="Select Date Range"
                    labelPlacement="outside"
                    value={bookedDateRange}
                    onChange={handleBookedDateRange}
                    variant="bordered"
                    
                  />
                </div>
                <div className="self-end">
                  <Button
                    size="md"
                    onPress={() => {
                      setCurrentPage(1);
                      fetchBookings();
                    }}
                  >
                    Apply Filter
                  </Button>
                </div>
              </div>
            </div>

            {/* Search Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  type="text"
                  label="Search (Booking ID, RPO ID, or RPO Name)"
                  labelPlacement="outside"
                  placeholder="Enter booking ID, RPO ID, or RPO name..."
                  className="h-10 text-sm w-full"
                  value={searchTerm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  onKeyPress={(e: KeyboardEvent<HTMLInputElement>) =>
                    e.key === "Enter" && handleSearch()
                  }
                />
              </div>
              <div>
                <Select
                  label="Select Status"
                  labelPlacement="outside"
                  placeholder="Select Status"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value as "All" | "Booked" | "Delivered",
                    )
                  }
                >
                  <SelectItem>All Status</SelectItem>
                  <SelectItem>Booked</SelectItem>
                  <SelectItem>Delivered</SelectItem>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button onPress={handleSearch} className="px-6">
                Search
              </Button>
            </div>
          </div>
          {/* Data Table */}

          <div className="w-full relative">
            <Table
              aria-label="Passport records table"
              classNames={{
                th: "bg-[#EDF2F7] dark:bg-gray-700 text-center",
                tr: "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                td: "dark:text-gray-200 text-center",
              }}
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn
                    key={column.uid}
                    className="ss:text-xs xxs:text-xs xs:text-sm sm:text-sm md:text-base"
                  >
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>

              <TableBody
                items={passportData}
                isLoading={loading}
                // loadingContent=
                emptyContent={
                  <div className="py-8 text-center">
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-300">
                      {error || "No data available."}
                    </p>
                  </div>
                }
              >
                {passportData.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-gray-50 dark:bg-gray-700/30"
                    }
                  >
                    {(columnKey) => (
                      <TableCell className="ss:text-xs xxs:text-xs xs:text-sm sm:text-sm md:text-base">
                        {renderCell({
                          data: item,
                          columnKey: columnKey,
                          index: index,
                          serial: (currentPage - 1) * pageSize,
                          // onAction: handleSearch,
                        })}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-center my-3">
            {totalPages > 1 && (
              <Pagination
                isCompact
                showControls
                page={currentPage}
                total={totalPages}
                onChange={(page) => {
                  setCurrentPage(page);
                }}
                className="overflow-x-visible"
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
export default DashboardComponent;
