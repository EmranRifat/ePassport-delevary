/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useRef } from "react";
import { Button, DateRangePicker, Select, SelectItem } from "@heroui/react";
import { LoadingSpinner } from "@/components/ui";

import { useGetAllBookings } from "@/lib/hooks/useGetAllBookings";
import Cookies from "js-cookie";
import { AllBookingResponse } from "@/lib/types";
import TableContent from "./TableContent";
import DatePickerModal from "@/components/modals/datePickerModal";
import LoaderSpinner from "../Common/LoaderSpinner";

const statusOptions = [
  { key: "All", label: "All Status" },
  { key: "Booked", label: "Booked" },
  { key: "Delivered", label: "Delivered" },
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
  const [bookingIdSearch, setBookingIdSearch] = useState("");
  const [rpoIdSearch, setRpoIdSearch] = useState("");
  const [rpoNameSearch, setRpoNameSearch] = useState("");
  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  const { getAllBookings, loading, error, data } = useGetAllBookings({ token });

  console.log("Getting_All_booking_Data==>", data);
  // Use ref to prevent multiple API calls on mount
  const hasFetchedRef = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        ...(bookingIdSearch && { barcode: bookingIdSearch }),
        ...(rpoIdSearch && { rop_code: rpoIdSearch }),
        ...(rpoNameSearch && { rpo_name: rpoNameSearch }),
      };

      console.log("Fetching bookings with:", requestData);
      const response = await getAllBookings(requestData);
      setDashboardData(response);
      setIsInitialLoad(false);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setIsInitialLoad(false);
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

  // Debounced search effect for all search fields
  useEffect(() => {
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Don't search on initial render
    if (!hasFetchedRef.current) {
      return;
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchBookings();
    }, 500); // 500ms debounce delay

    // Cleanup timeout on unmount or when search terms change
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [bookingIdSearch, rpoIdSearch, rpoNameSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalPages = dashboardData?.total_page || 1;
  const passportData = dashboardData?.passportissuedata || [];
  const totalBooked = dashboardData?.total_booked?.toString() || "0";
  const totalDelivered = dashboardData?.total_delivered?.toString() || "0";
  // Show error message if there's an error
  if (error) {
    console.error("API Error:", error);
  }

  return (
    <div >
     
        {/* Main Content */}
        <main className="flex-1 w-full px-1 md:px-3 py-4">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Dashboard</h2>
          </div>

          {/* All Filters Section */}
          <div className="mb-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow-sm">
            {/* Summary Statistics */}
            <div className="mb-2 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              
               <div className="flex flex-col md:flex-row md:items-center   gap-4 w-full lg:w-[78%]">
                 <div className="w-full bg-blue-50 dark:bg-blue-900/30 rounded-lg px-4 py-2  ">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/50 rounded-lg p-2">
                      <svg
                        className="w-5 h-5 text-blue-600 dark:text-blue-400"
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
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">
                        Booked
                      </p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {totalBooked}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-green-50 dark:bg-green-900/30 rounded-lg px-4 py-2 ">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-900/50 rounded-lg p-2">
                      <svg
                        className="w-5 h-5 text-green-600 dark:text-green-400"
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
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">
                        Delivered
                      </p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {totalDelivered}
                      </p>
                    </div>
                  </div>
                </div>
               </div>
                <div className="w-full lg:w-[20%] flex lg:justify-end ">
                    <Button
                   
                color="primary"
                className="flex items-center gap-2"
                onClick={() => setIsDateModalOpen(true)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print Report
              </Button>
                </div>
               

            
            </div>

            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Filters
              </h3>
            </div>

            {/* Search Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Select
                size="md"
                  label="Status"
                  placeholder="Select status"
                  aria-label="Filter by status"
                  selectedKeys={[statusFilter]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as
                      | "All"
                      | "Booked"
                      | "Delivered";
                    setStatusFilter(selected);
                  }}
                >
                  {statusOptions.map((status) => (
                    <SelectItem key={status.key}>{status.label}</SelectItem>
                  ))}
                </Select>
              </div>

              <div>
                <DateRangePicker
                  size="md"
                  label="Date Range"
                  aria-label="Select date range for filtering"
                  onChange={(value) => {
                    if (value && value.start && value.end) {
                      const formatDate = (date: any) => {
                        const year = date.year;
                        const month = String(date.month).padStart(2, "0");
                        const day = String(date.day).padStart(2, "0");
                        return `${year}-${month}-${day}`;
                      };
                      setStartDate(formatDate(value.start));
                      setEndDate(formatDate(value.end));
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mb-1.5">
            <h1 className="text-xs  text-gray-700 dark:text-gray-300">
              Total : {data?.total_item} items
            </h1>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600 dark:text-gray-300">
                Per Page :
              </span>
              <select
                className="px-1 md:px-2 py-0.5 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none "
                aria-label="Select items per page"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>80</option>
              </select>
            </div>
          </div>

          {/* Data Table */}
          {isInitialLoad ? (
            <LoaderSpinner />
          ) : (
            <TableContent
              loading={loading}
              error={error}
              passportData={passportData}
              currentPage={currentPage}
              pageSize={pageSize}
              totalPages={totalPages}
              bookingIdSearch={bookingIdSearch}
              rpoIdSearch={rpoIdSearch}
              rpoNameSearch={rpoNameSearch}
              setBookingIdSearch={setBookingIdSearch}
              setRpoIdSearch={setRpoIdSearch}
              setRpoNameSearch={setRpoNameSearch}
              setCurrentPage={setCurrentPage}
              setPageSize={setPageSize}
            />
          )}
        </main>
   

      {/* Date Range Modal */}
      <DatePickerModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onApply={(startDate, endDate) => {
          setStartDate(startDate);
          setEndDate(endDate);
          setIsDateModalOpen(false);
        }}
        passportData={passportData}
        totalBooked={totalBooked}
        totalDelivered={totalDelivered}
      />
    </div>
  );
};
export default DashboardComponent;
