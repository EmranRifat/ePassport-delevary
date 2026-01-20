import React from "react";
import { Input, Button, Pagination } from "@heroui/react";
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
        <div className="grid grid-cols-12 border-b border-gray-300 bg-gray-100">
          <div className="col-span-1 border-r border-gray-300 p-3 text-center">
            <p className="font-semibold text-sm text-gray-700">Serial No</p>
          </div>
          <div className="col-span-2 border-r border-gray-300 p-3 text-center">
            <p className="font-semibold text-sm text-gray-700">Date</p>
          </div>
          <div className="col-span-2 border-r border-gray-200 p-3">
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

          <div className="col-span-2 border-r border-gray-300 p-3">
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
          <div className="col-span-3 border-r border-gray-300 p-3">
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
          <div className="col-span-2 p-3 text-center">
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
                className={`grid grid-cols-12 border-b border-gray-300 hover:bg-gray-50 cursor-pointer ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <div className="col-span-1  p-3 text-center text-base">
                  {(currentPage - 1) * pageSize + index + 1}
                </div>
                <div className="col-span-2  p-3 text-center text-base">
                  {item.booking_date || item.created_at || "N/A"}
                </div>
                <div className="col-span-2  p-3 text-center text-base">
                  {item.barcode || "N/A"}
                </div>
                <div className="col-span-2  p-3 text-center text-base">
                  {item.post_code || "N/A"}
                </div>
                <div className="col-span-3  p-3 text-center text-base">
                  {item.rpo_name || item.rpo_address || "N/A"}
                </div>
                <div className="col-span-2 p-3 text-center text-base">
                  {item.booking_status || "N/A"}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
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
    </div>
  );
};

export default TableContent;
