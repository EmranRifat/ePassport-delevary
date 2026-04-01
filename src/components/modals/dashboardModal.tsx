"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
   
} from "@heroui/react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { printBookingPreview } from "@/utils/print-booking";
import { Button } from "../ui";
// Import Barcode dynamically to avoid SSR issues
const Barcode = dynamic(() => import("react-barcode"), { ssr: false });

export interface BookingResponse {
  id: number;
  barcode: string;
  item_id: string;

  booking_date: string; // "YYYY-MM-DD HH:mm:ss"
  booking_status: string;

  created_at: string; // ISO string
  updated_at: string; // ISO string

  pending_date: string;
  delivered_date: string | null;

  phone: string;
  post_code: string;

  price: string;
  total_charge: string;

  service_type: string;
  vas_type: string;

  rpo_name: string;
  rpo_address: string;

  user_id: string;

  insurance_id: string | null;
  insured: string; // "0" বা "1"

  is_check_today: number; // 0 বা 1
  push_status: number; // 0 বা 1
}
type RowDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: BookingResponse;
};

const RowDetailsModal: React.FC<RowDetailsModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  console.log("modal data>>>>>>>", data);
  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const printBookingPreview = () => {
    const printContent = document.getElementById("booking-preview-card");
    if (!printContent) return;

    const printWindow = window.open();
    if (!printWindow) return;

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>Print Booking - ${data.barcode}</title>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400&display=swap" rel="stylesheet">
  <style>
    @page {
      size: 4in 6in;
      margin: 0;
    }

    body {
      margin: 0;
       font-family: 'Open Sans';
       font-weight: 600;
       font-size: 16px;
      width: 4in;
      height: 6in;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    .preview-card {
      width: 3.2in;
      padding-top: 0.4in;
      color: #000;
    }

    /* Header */
    .header {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      margin-bottom: 14px;
      font-size: 16px;
      font-weight: 600;

    }

    .header img {
      width: 45px;
      height: 45px;
    }

    .header-center {
      text-align: center;
      line-height: 1.2;
    }

    .header-title {
      font-size: 16px;
      margin: 0;
      font-weight: normal;
    }

    .header-subtitle {
      font-size: 14px;
      margin: 0;
    }

    /* Issue date */
    .issue-date {
      font-size: 13px;
      margin-left: 6px;
      margin-bottom: 12px;
    }

    /* Barcode */
    .barcode-section {
      text-align: center;
      margin-bottom: 18px;
    }

    .barcode-container {
      width: 100%;
      height: 48px;
      display: flex;
       
      align-items: center;
    }

    .barcode-text {
      margin-top: 6px;
      letter-spacing: 1px;
    }

    /* Address */
    .address-section {
      margin-bottom: 16px;
      margin-left: 6px;
    }

    .address-title,
    .from-title {
      margin: 0 0 4px 0;
    }

    .address-text {
      margin: 2px 0;
      line-height: 1.3;
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>

<body>
  <div class="preview-card">

    <div class="header">
          
 <img src="/passport.png" />
      <div class="header-center">
        <div class="header-title">BPO</div>
        <div class="header-subtitle">e-Passport Booking</div>
      </div>
            
              <img src="/bpo.png" />

    </div>

    <div class="issue-date">
      Issue Date: ${getTodayDate()}
    </div>

    <div class="barcode-section">
      <div class="barcode-container">
        ${printContent.querySelector(".barcode-container")?.innerHTML || ""}
      </div>
      <div class="barcode-text">${data.barcode}</div>
    </div>

    <div class="address-section">
      <div class="address-title">To</div>
      <div class="address-text">${data.rpo_address}</div>
      <div class="address-text">Phone: ${data.phone}</div>
    </div>

    <div class="address-section">
      <div class="from-title">From</div>
      <div class="address-text">Passport Personalization Complex</div>
      <div class="address-text">Plot-4, Road-1, Sector-16(i), Diabari, Uttara</div>
      <div class="address-text">Dhaka-1711</div>
    </div>

  </div>

  <script>
  window.onload = async () => {
    await document.fonts.ready; // wait for Open Sans to load
    window.print();
    window.onafterprint = () => window.close();
  };
</script>
</body>
</html>
`);
    printWindow.document.close();
  };
  const onPrint = () => {
    // Print on success
    printBookingPreview();
  };
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="center" size="2xl">
      <ModalContent>
        {(close) => (
          <div>
            <ModalHeader className="text-lg font-semibold">
              Passport Details
            </ModalHeader>

            <ModalBody className="py-2 px-6">
              {/* Title */}
              <h2 className="text-center text-lg font-semibold mb-4">
                Barcode Already Booked
              </h2>

              {/* Card */}
              <div className="p-6">
                {/* Booking Preview Card */}
                <div
                  id="booking-preview-card"
                  className="border-2 border-black dark:border-gray-700 rounded-lg p-6 mb-8"
                >
                  {/* Header with Icons */}
                  <div className="flex items-center justify-between px-5 mb-5">
                    <div className="w-[45px] h-[45px] relative">
                      <Image
                        src="/bpo.png"
                        alt="BPO"
                        width={65}
                        height={65}
                        className="object-contain"
                      />
                    </div>
                    <div className="text-center">
                      <h2 className="text-[22px] font-normal text-black dark:text-white leading-tight">
                        BPO
                      </h2>
                      <p className="text-lg text-black dark:text-gray-100">
                        e-Passport Booking
                      </p>
                    </div>
                    <div className="w-[45px] h-[45px] relative">
                      <Image
                        src="/passport.png"
                        alt="Passport"
                        width={65}
                        height={65}
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Issue Date */}
                  <div className="text-center mb-3.5">
                    <p className="text-mdDG817791512BD text-gray-900 dark:text-gray-100">
                      Issue Date : {data?.booking_date || "31-03-2026"}
                    </p>
                  </div>

                  {/* Barcode Section */}
                  <div className="flex flex-col items-center mb-2">
                    {data ? (
                      <>
                        <div className="barcode-container h-9 w-[250px] md:w-[350px] flex items-center justify-center">
                          <Barcode
                            value={data.barcode}
                            height={55}
                            width={2.6}
                            displayValue={false}
                            background="#fefefe"
                          />
                        </div>
                        <p className="text-lg text-gray-800 mt-3 dark:text-gray-100">
                          {data.barcode}
                        </p>
                      </>
                    ) : null}
                  </div>

                  {/* To Section */}
                  <div className="w-full px-2.5 py-2.5">
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      To
                    </p>
                    <p className="text-lg font-normal text-gray-900 dark:text-gray-100">
                      {data.rpo_name}
                    </p>
                    <p className="text-lg font-normal text-gray-900 dark:text-gray-100">
                      Phone: {data.phone}
                    </p>
                  </div>

                  {/* From Section */}
                  <div className="w-full px-2.5 py-2.5">
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      From
                    </p>
                    <p className="text-lg text-gray-900 dark:text-gray-100">
                      Passport Personalization Complex
                    </p>
                    <p className="text-lg text-gray-900 dark:text-gray-100">
                      Plot-4, Road-1, Sector-16(i), Diabari, Uttara
                    </p>
                    <p className="text-lg text-gray-900 dark:text-gray-100">
                      Dhaka-1711
                    </p>
                  </div>
                </div>

                {/* Barcode Input hidden from UI, still used for scanner capture */}

                {/*================ all buttons here ==================*/}

                {/* Action Buttons */}
              </div>

              {/* Buttons */}
              <div className="flex justify-between gap-4 mt-4">
                <Button variant="danger"   onClick={close}>cancel</Button>

                <Button variant="primary" onClick={onPrint}>print</Button>
              </div>
            </ModalBody>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default RowDetailsModal;
