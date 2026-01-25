import React from "react";
import {
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Table,
  Pagination,
} from "@heroui/react";
// import { LoadingSpinner } from "@/components/ui";
import { TableContentProps } from "@/lib/types";

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
    name: "Service Type",
    uid: "service_type",
  },
  {
    name: "RPO Address",
    uid: "rpo_address",
  },
  {
    name: "Status",
    uid: "status",
  },
];
const TableContent: React.FC<TableContentProps> = ({
  data,
  loading: _loading,
  error,
  passportData,
  currentPage,
  pageSize,
  totalPages,
  setCurrentPage,
  setPageSize,
}) => {
  // console.log("Passport data==", passportData);
  return (
    <div>
      {/* Pagination Controls */}
      <div className="flex items-center justify-between my-2 md:my-3">
        <h1 className="text-sm  text-gray-700 dark:text-gray-300">
          Total : {data?.total_item} items
        </h1>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">
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
      <div className="w-full relative mb-2">
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
                className="ss:text-xs xxs:text-xs xs:text-sm sm:text-sm md:text-base mb-0"
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>

          <TableBody
            items={passportData}
            // isLoading={loading}
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
      <div className="flex justify-center mt-6">
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
