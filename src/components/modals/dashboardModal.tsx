"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@heroui/react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { printBookingPreview } from "@/utils/print-booking";

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
  // console.log("modal data>>>>>>>", data);

  const formatted = data?.booking_date
    ? (() => {
        const d = new Date(data.booking_date.replace(" ", "T"));
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
      })()
    : "-";

  const onPrint = () => {
    // Print on success
    printBookingPreview({
      barcodeInput: data.barcode,
      selectedRPO: {
        address: data.rpo_address,
        mobile: data.phone,
      },
      getTodayDate: () => formatted,
    });
  };
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="center" size="2xl" hideCloseButton >
      <ModalContent>
        {(close) => (
          <div>
            <ModalHeader className="text-lg font-semibold">
              Passport Details
            </ModalHeader>

            <ModalBody className="py-2 px-6">
              {/* Title */}
              <h2 className="text-center text-xl font-semibold mb-4">
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
                  <div className="pl-10 my-3.5">
                    <p className="text-mdDG817791512BD text-gray-900 dark:text-gray-100">
                      Issue Date : {formatted || ""}
                    </p>
                  </div>

                  {/* Barcode Section */}
                  <div className="flex flex-col items-start pl-8 mb-2">
                    {data ? (
                      <>
                        <div className="barcode-container h-10 w-[250px] md:w-[350px] flex items-center  ">
                          <Barcode
                            value={data.barcode}
                            height={55}
                            width={2.6}
                            displayValue={false}
                            background="#fefefe"
                          />
                        </div>
                        <p className="text-lg text-gray-800 mt-3 ml-24 dark:text-gray-100">
                          {data.barcode}
                        </p>
                      </>
                    ) : null}
                  </div>

                  {/* To Section */}
                  <div className="w-full pl-10 py-2.5">
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      To
                    </p>
                    <p className="text-lg font-normal text-gray-900 dark:text-gray-100">
                      {data.rpo_address}
                    </p>
                    <p className="text-lg font-normal text-gray-900 dark:text-gray-100">
                      Phone: {data.phone}
                    </p>
                  </div>

                  {/* From Section */}
                  <div className="w-full pl-10 py-2.5">
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
                <div className="flex justify-between gap-4 my-4">
                  <Button variant="light" color="danger" size="md" onPress={close}>
                    cancel
                  </Button>

                  <Button color="primary" size="md" onPress={onPrint}>
                    print
                  </Button>
                </div>
              </div>
            </ModalBody>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default RowDetailsModal;
