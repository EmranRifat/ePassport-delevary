import React from "react";
import { Input, Button } from "@heroui/react";
import { LoadingSpinner } from "@/components/ui";

interface TableContentProps {
  loading: boolean;
  error: string | null;
  passportData: any[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  bookingIdSearch: string;
  rpoIdSearch: string;
  rpoNameSearch: string;
  setBookingIdSearch: (value: string) => void;
  setRpoIdSearch: (value: string) => void;
  setRpoNameSearch: (value: string) => void;
  setCurrentPage: (value: number) => void;
  setPageSize: (value: number) => void;
}

const TableContent: React.FC<TableContentProps> = ({
  loading,
  error,
  passportData,
  currentPage,
  pageSize,
  totalPages,
  bookingIdSearch,
  rpoIdSearch,
  rpoNameSearch,
  setBookingIdSearch,
  setRpoIdSearch,
  setRpoNameSearch,
  setCurrentPage,
  setPageSize,
}) => {
  return (
    <div>
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-6 border-b border-gray-300 bg-gray-100">
          <div className="border-r border-gray-300 p-3 text-center">
            <p className="font-semibold text-sm text-gray-700">#</p>
          </div>
          <div className="border-r border-gray-300 p-3 text-center">
            <p className="font-semibold text-sm text-gray-700">Date</p>
          </div>
          <div className="border-r border-gray-200 p-3">
            <p className="font-semibold text-sm text-gray-700 text-center mb-2">
              Booking ID
            </p>
            <Input
              type="text"
              size="sm"
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

          <div className="border-r border-gray-300 p-3">
            <p className="font-semibold text-sm text-gray-700 text-center mb-2">
              RPO ID
            </p>
            <Input
              type="text"
              size="sm"
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
          <div className="border-r border-gray-300 p-3">
            <p className="font-semibold text-sm text-gray-700 text-center mb-2">
              RPO Name
            </p>
            <Input
              type="text"
              size="sm"
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
          <div className="p-3 text-center">
            <p className="font-semibold text-sm text-gray-700">Status</p>
          </div>
        </div>

        {/* Table Body */}
        {error ? (
          <div className="flex items-center justify-center py-8">
            <span className="text-base text-red-500">Error: {error}</span>
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
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage(currentPage + 1);
                }}
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
    </div>
  );
};

export default TableContent;
