"use client";

import React, { useState } from "react";
import { I18nProvider } from "@react-aria/i18n";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  DateRangePicker,
} from "@heroui/react";
import { usePostEPassportReport } from "@/lib/hooks/usePostBookingReport";
import { ReportData } from "@/lib/types";
import { useAuthStore } from "@/store";

interface DateValue {
  year: number;
  month: number;
  day: number;
}

type DateRange = {
  start: DateValue | null;
  end: DateValue | null;
} | null;

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (startDate: string, endDate: string) => void;
  userId: string;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  const [tempDateRange, setTempDateRange] = useState<DateRange>(null);

  const { user } = useAuthStore();

  // const { mutateAsync, isPending, error ,data} = usePostEPassportReport();
  const { mutate, isPending, error, data } = usePostEPassportReport();

  console.log("mutateAsync data -->", data);

  const formatDate = (date: DateValue) => {
    const year = date.year;
    const month = String(date.month).padStart(2, "0");
    const day = String(date.day).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const buildPrintContent = (
    reportData: ReportData[],
    printStartDate: string,
    printEndDate: string,
  ) => {
    const pdfDateFormatter = (dateString: string): string => {
      const dateObj = new Date(dateString);
      const date = dateObj.toISOString().split("T")[0];
      const ampm = dateObj.getHours() >= 12 ? "PM" : "AM";
      return `${date} ${ampm}`;
    };

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>e-Passport Booking Report</title>
        <style>
  @page {
    size: A4 portrait;
    margin: 10mm;
  }

  html,
  body {
    margin: 0;
    padding: 0;
  }

  body {
    font-family: Arial, sans-serif;
    padding: 0;
    margin: 0;
    position: relative;
    text-align: center;
  }

  .header {
    text-align: center;
    margin: 0 0 6px 0;
    padding: 0;
  }

  .header h1 {
    margin: 0;
    padding: 0;
    font-size: 18px;
    font-weight: normal;
    line-height: 1.15;
  }

  .header h2 {
    margin: 0;
    padding: 0;
    font-size: 16px;
    font-weight: normal;
    line-height: 1.15;
  }

  .header h3 {
    margin: 2px 0 0 0;
    padding: 0;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.15;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    margin: 4px 0 4px 0;
    font-size: 14px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 4px;
  }

  th,
  td {
    border: 1px solid #000;
    padding: 6px;
    text-align: left;
    font-size: 12px;
  }

  th {
    background-color: #f3f4f6;
    font-weight: 600;
  }

  tr:nth-child(even) {
    background-color: #f9fafb;
  }

  .no-data {
    text-align: center;
    padding: 40px;
    color: #6b7280;
  }

  thead {
    display: table-header-group;
  }

  tfoot {
    display: table-footer-group;
  }

  tr {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  @media print {
    html,
    body {
      margin: 0;
      padding: 0;
    }

    body {
      padding: 0;
      margin: 0;
    }

    .no-print {
      display: none;
    }

    table {
      page-break-inside: auto;
    }

    tr {
      break-inside: avoid;
      page-break-inside: avoid;
      page-break-after: auto;
    }
  }
</style>
      </head>
      <body>
        <div class="header">
          <h1>Bangladesh Post Office</h1>
          <h2>e-Passport Booking</h2>
          <h3>Daily Report for: ${printStartDate} to ${printEndDate}</h3>
        </div>
        <div class="info-row">
          <div>Operator Name: ${user?.name}</div>
          <div>Total page: <span class="page-count"></span></div>
        </div>

        ${
          reportData.length === 0
            ? '<div class="no-data">No data available for the selected date range</div>'
            : `<table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Booking ID</th>
                    <th>RPO ID</th>
                    <th>RPO Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${reportData
                    .map(
                      (item: ReportData, index: number) => `
                        <tr>
                          <td>${index + 1}</td>
                          <td>${pdfDateFormatter(item.booking_date) || pdfDateFormatter(item.created_at) || "N/A"}</td>
                          <td>${item.barcode || "N/A"}</td>
                          <td>${item.post_code || "N/A"}</td>
                          <td>${item.rpo_name || item.rpo_address || "N/A"}</td>
                          <td>${item.booking_status || "N/A"}</td>
                        </tr>
                      `,
                    )
                    .join("")}
                </tbody>
              </table>`
        }

        // <script>
        //   function updatePageCount() {
        //     const mmToPx = 96 / 25.4;
        //     const printableHeightMm = 297 - 20;
        //     const printableHeightPx = printableHeightMm * mmToPx;
        //     const pages = Math.max(
        //       1,
        //       Math.ceil(document.body.scrollHeight / printableHeightPx),
        //     );
        //     const pageCountEl = document.querySelector('.page-count');
        //     if (pageCountEl) {
        //       pageCountEl.textContent = String(pages);
        //     }
        //   }

        //   window.onload = function() {
        //     updatePageCount();
        //     setTimeout(() => {
        //       window.print();
        //     }, 100);
        //   };

        //   window.onafterprint = function() {
        //     window.close();
        //   };
        // </script>














        <script>
  function updatePageCount() {
    const mmToPx = 96 / 25.4;

    // A4: 297mm height, @page margin top+bottom = 10mm + 10mm
    const pageHeightPx = (297 - 20) * mmToPx;

    const body = document.body;
    const header = document.querySelector('.header');
    const infoRow = document.querySelector('.info-row');
    const table = document.querySelector('table');
    const pageCountEl = document.querySelector('.page-count');

    if (!pageCountEl) return;

    // No table/data => always 1 page
    if (!table) {
      pageCountEl.textContent = '1';
      return;
    }

    const bodyTop = body.getBoundingClientRect().top;

    // Space used before the table on the first page only
    const headerBottom = infoRow
      ? infoRow.getBoundingClientRect().bottom
      : (header ? header.getBoundingClientRect().bottom : bodyTop);

    const firstPageUsed = headerBottom - bodyTop + 6; // + small buffer
    const firstPageAvailable = Math.max(0, pageHeightPx - firstPageUsed);

    // Find the bottom of the LAST row, not scrollHeight
    const rows = table.querySelectorAll('tbody tr');
    const lastRow = rows.length ? rows[rows.length - 1] : table;

    const tableTop = table.getBoundingClientRect().top - bodyTop;
    const lastRowBottom = lastRow.getBoundingClientRect().bottom - bodyTop;

    const contentInsideTable = lastRowBottom - tableTop;

    let pages = 1;

    if (contentInsideTable > firstPageAvailable) {
      const remaining = contentInsideTable - firstPageAvailable;
      pages += Math.ceil(remaining / pageHeightPx);
    }

    pageCountEl.textContent = String(Math.max(1, pages));
  }

  function printWithPageCount() {
    updatePageCount();

    // one more frame helps browser finish layout before print preview
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updatePageCount();
        window.print();
      });
    });
  }

  window.addEventListener('load', printWithPageCount);
  window.addEventListener('beforeprint', updatePageCount);

  window.addEventListener('afterprint', () => {
    window.close();
  });
</script>

        
      </body>
    </html>
  `;
  };

  const printHtml = (html: string) => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "-9999px";
    iframe.style.top = "0";
    iframe.style.width = "210mm";
    iframe.style.height = "297mm";
    iframe.style.border = "0";
    iframe.style.visibility = "hidden";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (!iframeDoc) return;

    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();

    setTimeout(() => {
      try {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      } catch (err) {
        console.log(err);
      }
    }, 3000);
  };

  const handlePrint = () => {
    if (!tempDateRange?.start || !tempDateRange?.end) return;

    const printStartDate = formatDate(tempDateRange.start);
    const printEndDate = formatDate(tempDateRange.end);

    mutate(
      {
        user_id: userId,
        start_date: printStartDate,
        end_date: printEndDate,
      },
      {
        onSuccess: (res) => {
          const printContent = buildPrintContent(
            res.data,
            printStartDate,
            printEndDate,
          );

          setTempDateRange(null);
          onClose();

          setTimeout(() => {
            printHtml(printContent);
          }, 200);
        },
        onError: (error) => {
          console.error("Print report failed:", error);
        },
      },
    );
  };

  const handleCancel = () => {
    setTempDateRange(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" backdrop="blur">
      <ModalContent className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
        <ModalHeader className="flex flex-col gap-1 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
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
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Select Date Range for Report Print
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Choose a start and end date for your filter
              </p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="py-6">
          <div className="dark:bg-postDarker  rounded">
            <I18nProvider locale="en-GB">
              <DateRangePicker
                label="Date Range"
                variant="bordered"
                className="w-full"
                aria-label="Select date range for report"
                onChange={(value) => {
                  setTempDateRange(value as DateRange);
                }}
              />
            </I18nProvider>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-3">
              {error.message || "Failed to generate report"}
            </p>
          )}
        </ModalBody>

        <ModalFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <Button
            color="danger"
            variant="flat"
            onClick={handleCancel}
            className="font-medium"
          >
            Cancel
          </Button>

          <Button
            color="primary"
            onClick={handlePrint}
            className="font-medium flex items-center gap-2"
            isDisabled={
              !tempDateRange?.start || !tempDateRange?.end || isPending
            }
            isLoading={isPending}
          >
            Print
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
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DatePickerModal;
