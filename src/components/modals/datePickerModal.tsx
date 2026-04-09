/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (startDate: string, endDate: string) => void;
  passportData?: any[];
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  onClose,
  onApply,
  passportData = [],
}) => {
  const [tempDateRange, setTempDateRange] = useState<any>(null);
  const formatDate = (date: any) => {
    const year = date.year;
    const month = String(date.month).padStart(2, "0");
    const day = String(date.day).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const handlePrint = () => {
    if (!tempDateRange || !tempDateRange.start || !tempDateRange.end) return;

    const printStartDate = formatDate(tempDateRange.start);
    const printEndDate = formatDate(tempDateRange.end);

    // const printWindow = window.open("", "_blank");
    // if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>e-Passport Booking Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; position: relative; }
            .logo { position: absolute; top: 20px; left: 20px; width: 60px; height: 60px; }
            .header { text-align: center; margin-bottom: 30px; padding-top: 10px; }
            .header h1 { margin: 5px 0; font-size: 18px; font-weight: normal; }
            .header h2 { margin: 5px 0; font-size: 16px; font-weight: normal; }
            .header h3 { margin: 5px 0; font-size: 14px; font-weight: normal; }
            .info-row { display: flex; justify-content: space-between; margin: 10px 0; font-size: 14px; }
            .summary { text-align: center; margin-bottom: 20px; font-size: 14px; }
            .summary p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f3f4f6; font-weight: 600; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .no-data { text-align: center; padding: 40px; color: #6b7280; }
            @media print {
              body { padding: 10px; }
              .no-print { display: none; }
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
            <div>Operator Name: Samsu</div>
            <div>Total page 1</div>
          </div>
         
          ${
            passportData.length === 0
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
                ${passportData
                  .map(
                    (item: any, index: number) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${item.booking_date || item.created_at || "N/A"}</td>
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
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `;

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    // Write content to iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(printContent);
      iframeDoc.close();

      // Clean up iframe after print dialog closes (with delay to account for print dialog duration)
      setTimeout(() => {
        try {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        } catch (error) {
          // Silently fail if iframe is already removed
          console.log(error);
        }
      }, 3000);
    }
  };

  const handleApply = () => {
    if (tempDateRange && tempDateRange.start && tempDateRange.end) {
      const formattedStartDate = formatDate(tempDateRange.start);
      const formattedEndDate = formatDate(tempDateRange.end);
      onApply(formattedStartDate, formattedEndDate);
      setTempDateRange(null);
    }
  };

  const handleCancel = () => {
    setTempDateRange(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-lg p-2">
                  <svg
                    className="w-6 h-6 text-blue-600"
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
                  <h3 className="text-xl font-semibold text-gray-800">
                    Select Date Range for Report Print
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Choose a start and end date for your filter
                  </p>
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="py-6">
              <div className="space-y-4">
                <I18nProvider locale="en-GB">
                  <DateRangePicker
                    label="Date Range"
                    variant="bordered"
                    className="w-full"
                    aria-label="Select date range for report"
                    onChange={(value) => {
                      setTempDateRange(value);
                    }}
                  />
                </I18nProvider>
              </div>
            </ModalBody>
            <ModalFooter className="border-t border-gray-200 pt-4">
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
                  !tempDateRange || !tempDateRange.start || !tempDateRange.end
                }
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
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DatePickerModal;
