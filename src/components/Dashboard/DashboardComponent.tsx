"use client";

import { useState, useEffect, useRef } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
// import { Button, LoadingSpinner, Input } from "@/components/ui";

import { useGetAllBookings } from "@/lib/hooks/useGetAllBookings";
import Cookies from "js-cookie";
import { AllBookingResponse } from "@/lib/types";
import { Button, DateRangePicker, Input } from "@heroui/react";
import { LoadingSpinner } from "../ui";

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
                </div>
                <div className="self-end">
                  <Button
                    onClick={() => {
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search (Booking ID, RPO ID, or RPO Name)
                </label>
                <Input
                  type="text"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value as "All" | "Booked" | "Delivered",
                    )
                  }
                >
                  <option value="All">All Status</option>
                  <option value="Booked">Booked</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={handleSearch} className="px-6">
                Search
              </Button>
            </div>
            <div className="">
              <DateRangePicker />
            </div>
          </div>

          <Button color="danger">Danger</Button>

          <div>
            <Input
              // size="md"
              label="Search by Serial Number"
              // labelPlacement="outside"
              placeholder="Search by Serial Number"
            />
          </div>

          {/* Data Table */}
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-6 border-b border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700">
              <div className="border-r border-gray-300 dark:border-gray-700 p-3 text-center">
                <p className="font-semibold text-sm text-gray-700 dark:text-gray-200">
                  #
                </p>
              </div>
              <div className="border-r border-gray-300 dark:border-gray-700 p-3 text-center">
                <p className="font-semibold text-sm text-gray-700 dark:text-gray-200">
                  Date
                </p>
              </div>
              <div className="border-r border-gray-300 dark:border-gray-700 p-3 text-center">
                <p className="font-semibold text-sm text-gray-700 dark:text-gray-200">
                  Booking ID
                </p>
              </div>
              <div className="border-r border-gray-300 dark:border-gray-700 p-3 text-center">
                <p className="font-semibold text-sm text-gray-700 dark:text-gray-200">
                  RPO ID
                </p>
              </div>
              <div className="border-r border-gray-300 dark:border-gray-700 p-3 text-center">
                <p className="font-semibold text-sm text-gray-700 dark:text-gray-200">
                  RPO Name
                </p>
              </div>
              <div className="p-3 text-center">
                <p className="font-semibold text-sm text-gray-700 dark:text-gray-200">
                  Status
                </p>
              </div>
            </div>

            {/* Table Body */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-base dark:text-gray-200">
                  Loading...
                </span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-8">
                <span className="text-base text-red-500 dark:text-red-400">
                  Error: {error}
                </span>
              </div>
            ) : passportData.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <span className="text-base dark:text-gray-300">
                  No Data Found
                </span>
              </div>
            ) : (
              <div className="max-h-[500px] overflow-y-auto">
                {passportData.map((item, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-6 border-b border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-gray-50 dark:bg-gray-750"
                    }`}
                  >
                    <div className="border-r border-gray-300 dark:border-gray-700 p-3 text-center text-base dark:text-gray-200">
                      {(currentPage - 1) * pageSize + index + 1}
                    </div>
                    <div className="border-r border-gray-300 dark:border-gray-700 p-3 text-center text-base dark:text-gray-200">
                      {item.booking_date || item.created_at || "N/A"}
                    </div>
                    <div className="border-r border-gray-300 dark:border-gray-700 p-3 text-center text-base dark:text-gray-200">
                      {item.barcode || "N/A"}
                    </div>
                    <div className="border-r border-gray-300 dark:border-gray-700 p-3 text-center text-base dark:text-gray-200">
                      {item.post_code || "N/A"}
                    </div>
                    <div className="border-r border-gray-300 dark:border-gray-700 p-3 text-center text-base dark:text-gray-200">
                      {item.rpo_name || item.rpo_address || "N/A"}
                    </div>
                    <div className="p-3 text-center text-base dark:text-gray-200">
                      {item.booking_status || "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {passportData.length > 0 && (
              <div className="border-t border-gray-300 dark:border-gray-700 p-4 flex items-center justify-center space-x-4 bg-gray-100 dark:bg-gray-700">
                <span className="text-base font-semibold dark:text-gray-200">
                  {currentPage} of {totalPages}
                </span>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="flat"
                    size="sm"
                    color="primary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          className={`px-3 py-1 text-sm rounded ${
                            currentPage === pageNum
                              ? "bg-gray-600 dark:bg-gray-500 text-white"
                              : "bg-white dark:bg-gray-800 text-black dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    // variant="solid"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 dark:text-gray-200"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
export default DashboardComponent;
