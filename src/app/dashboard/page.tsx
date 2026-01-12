"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, LoadingSpinner, Input } from "@/components/ui";
import { Sidebar } from "@/components/layout";
import { useAuthStore } from "@/store";
import { passportApi } from "@/lib/api-services";
import { handleApiError } from "@/lib/error-handler";

interface PassportIssueData {
  user_id?: string;
  insurance_id?: string;
  rpo_address?: string;
  rpo_name?: string;
  phone?: string;
  post_code?: string;
  barcode?: string;
  item_id?: string;
  total_charge?: string;
  service_type?: string;
  vas_type?: string;
  price?: string;
  insured?: string;
  booking_status?: string;
  created_at?: string;
  updated_at?: string;
  booking_date?: string;
}

interface DashboardResponse {
  status_code?: string;
  status?: string;
  total_item?: string;
  total_booked?: string;
  total_delivered?: string;
  total_page?: number;
  passportissuedata?: PassportIssueData[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("All");
  const [barcodeSearch, setBarcodeSearch] = useState("");
  const [rpoIdSearch, setRpoIdSearch] = useState("");
  const [rpoNameSearch, setRpoNameSearch] = useState("");

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    pageSize,
    statusFilter,
    barcodeSearch,
    rpoIdSearch,
    rpoNameSearch,
  ]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await passportApi.getDashboard();
      if (response.data) {
        setDashboardData(response.data as DashboardResponse);
      }
    } catch (err) {
      const apiError = handleApiError(err);
      console.warn("Dashboard data fetch failed:", apiError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    document.cookie = "auth-token=; path=/; max-age=0";
    router.push("/login");
  };

  const totalPages = dashboardData?.total_page || 1;
  const passportData = dashboardData?.passportissuedata || [];
  const totalBooked = dashboardData?.total_booked || "0";
  const totalDelivered = dashboardData?.total_delivered || "0";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bangladesh Post Office
              </h1>
              <p className="text-sm text-gray-600">ePassport Issuing Portal</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || user?.user_id || "User"}
                </p>
                <p className="text-xs text-gray-600">Welcome</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          </div>

          {/* Summary Statistics */}
          <div className="mb-6">
            <div className="bg-white border border-gray-300 rounded-md inline-block">
              <table className="border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-12 py-3 bg-gray-100 text-base font-semibold">
                      Booked
                    </th>
                    <th className="border border-gray-300 px-12 py-3 bg-gray-100 text-base font-semibold">
                      Delivered
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-12 py-2 text-center text-base">
                      {totalBooked}
                    </td>
                    <td className="border border-gray-300 px-12 py-2 text-center text-base">
                      {totalDelivered}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white border border-gray-300 rounded-md overflow-hidden">
            {/* Table Header with Filters */}
            <div className="grid grid-cols-6 border-b border-gray-300 bg-gray-100">
              <div className="border-r border-gray-300 p-3 text-center">
                <p className="font-semibold text-base">Serial No</p>
              </div>
              <div className="border-r border-gray-300 p-3 text-center">
                <p className="font-semibold text-base mb-2">Date</p>
              </div>
              <div className="border-r border-gray-300 p-3 text-center">
                <p className="font-semibold text-base mb-2">Booking ID</p>
                <Input
                  type="text"
                  placeholder="Search..."
                  className="h-8 text-sm"
                  value={barcodeSearch}
                  onChange={(e) => setBarcodeSearch(e.target.value)}
                />
              </div>
              <div className="border-r border-gray-300 p-3 text-center">
                <p className="font-semibold text-base mb-2">RPO ID</p>
                <Input
                  type="text"
                  placeholder="Search..."
                  className="h-8 text-sm"
                  value={rpoIdSearch}
                  onChange={(e) => setRpoIdSearch(e.target.value)}
                />
              </div>
              <div className="border-r border-gray-300 p-3 text-center">
                <p className="font-semibold text-base mb-2">RPO Name</p>
                <Input
                  type="text"
                  placeholder="Search..."
                  className="h-8 text-sm"
                  value={rpoNameSearch}
                  onChange={(e) => setRpoNameSearch(e.target.value)}
                />
              </div>
              <div className="p-3 text-center">
                <p className="font-semibold text-base mb-2">Status</p>
                <select
                  className="w-full h-8 px-2 border border-gray-300 rounded text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Booked">Booked</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* Table Body */}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-base">Loading...</span>
              </div>
            ) : passportData.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <span className="text-base">No Data Found</span>
              </div>
            ) : (
              <div className="max-h-[500px] overflow-y-auto">
                {passportData.map((item, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-6 border-b border-gray-300 hover:bg-gray-50 cursor-pointer ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <div className="border-r border-gray-300 p-3 text-center text-base">
                      {(currentPage - 1) * pageSize + index + 1}
                    </div>
                    <div className="border-r border-gray-300 p-3 text-center text-base">
                      {item.booking_date || item.created_at || "N/A"}
                    </div>
                    <div className="border-r border-gray-300 p-3 text-center text-base">
                      {item.barcode || "N/A"}
                    </div>
                    <div className="border-r border-gray-300 p-3 text-center text-base">
                      {item.post_code || "N/A"}
                    </div>
                    <div className="border-r border-gray-300 p-3 text-center text-base">
                      {item.rpo_name || item.rpo_address || "N/A"}
                    </div>
                    <div className="p-3 text-center text-base">
                      {item.booking_status || "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {passportData.length > 0 && (
              <div className="border-t border-gray-300 p-4 flex items-center justify-center space-x-4 bg-gray-100">
                <span className="text-base font-semibold">
                  {currentPage} of {totalPages}
                </span>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
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
                              ? "bg-gray-600 text-white"
                              : "bg-white text-black border border-gray-300 hover:bg-gray-200"
                          }`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    className="px-3 py-1 border border-gray-300 rounded text-sm bg-white"
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
}
