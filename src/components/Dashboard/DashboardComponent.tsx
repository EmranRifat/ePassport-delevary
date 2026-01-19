"use client";

import { useState, useEffect, useRef } from "react";
import { useGetAllBookings } from "@/lib/hooks/useGetAllBookings";
import Cookies from "js-cookie";
import { AllBookingResponse } from "@/lib/types";
import {
  Button,
  DateRangePicker,
  Input,
  Pagination,
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
          {/* <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          </div> */}

          {/* All Filters Section */}
          <div className="mb-6 bg-white border border-gray-300 rounded-lg p-5 shadow-sm">
            {/* Summary Statistics */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex gap-4">
                <div className="bg-blue-50 rounded-lg px-4 py-2 min-w-[180px] w-[580px]">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 rounded-lg p-2">
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
                      <p className="text-xs font-medium text-gray-600 uppercase">
                        Booked
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {totalBooked}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg px-4 py-2 min-w-[180px] w-[580px]">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 rounded-lg p-2">
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
                      <p className="text-xs font-medium text-gray-600 uppercase">
                        Delivered
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {totalDelivered}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Print */}
              <Button
                color="secondary"
                className="flex items-center gap-2 md:ml-auto"
              >
                Report Print
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
              </Button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
            </div>

            {/* Search Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select
                  size="md"
                  label="Status"
                  labelPlacement="outside"
                  placeholder="Select status"
                  variant="bordered"
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
                  labelPlacement="outside"
                  variant="bordered"
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

            <div className="flex gap-8 my-5 w-full ">
              <div className="w-[49%] ">
                <Input
                  type="text"
                  size="md"
                  label=" Search Booking ID"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Search..."
                  value={bookingIdSearch}
                  onChange={(e) => setBookingIdSearch(e.target.value)}
                  isClearable
                  onClear={() => setBookingIdSearch("")}
                  startContent={
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  }
                  classNames={{
                    input: "text-xs",
                    inputWrapper: "h-6 bg-white hover:bg-gray-50",
                  }}
                />
              </div>

              <div className="w-[49%] ">
                <Input
                  type="text"
                  size="md"
                  label=" Search RPO ID"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Search..."
                  value={rpoIdSearch}
                  onChange={(e) => setRpoIdSearch(e.target.value)}
                  isClearable
                  onClear={() => setRpoIdSearch("")}
                  startContent={
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  }
                  classNames={{
                    input: "text-xs",
                    inputWrapper: "h-6 bg-white hover:bg-gray-50",
                  }}
                />
              </div>
            
               
            </div>
              <div className="w-[49%] pt-4 ">
                <Input
                  type="text"
                  size="md"
                  label=" Search RPO Name"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Search..."
                  value={rpoNameSearch}
                  onChange={(e) => setRpoNameSearch(e.target.value)}
                  isClearable
                  onClear={() => setRpoNameSearch("")}
                  startContent={
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  }
                  classNames={{
                    input: "text-xs",
                    inputWrapper: "h-6 bg-white hover:bg-gray-50",
                  }}
                />
              </div>
          </div>
           

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
