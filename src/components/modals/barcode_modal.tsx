import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button, Input } from "@/components/ui";
import { RegionalPassportOffice } from "@/utils/address-util";
import { printBookingPreview } from "@/utils/print-booking";

// Import Barcode dynamically to avoid SSR issues
const Barcode = dynamic(() => import("react-barcode"), { ssr: false });

interface BarcodeModalProps {
  showModal: boolean;
  selectedRPO: RegionalPassportOffice | null;
  barcodeInput: string;
  setBarcodeInput: (value: string) => void;
  isScanning: boolean;
  handleCloseModal: () => void;
  handleScan: () => void;
  handleOk: () => void;
  getTodayDate: () => string;
  handlePrint?: () => void;
}

const BarcodeModal: React.FC<BarcodeModalProps> = ({
  showModal,
  selectedRPO,
  barcodeInput,
  setBarcodeInput,
  isScanning,
  handleCloseModal,
  handleScan,
  handleOk,
  getTodayDate,
  handlePrint,
}) => {
  if (!showModal || !selectedRPO) {
    return null;
  }

  const onPrint = () => {
    if (handlePrint) {
      handlePrint();
    } else {
      printBookingPreview({
        barcodeInput,
        selectedRPO,
        getTodayDate,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Booking Preview Card */}
          <div
            id="booking-preview-card"
            className="border-2 border-black rounded-lg p-6 mb-6"
          >
            {/* Header with Icons */}
            <div className="flex items-center justify-between px-5 mb-5">
              <div className="w-[35px] h-[35px] relative">
                <Image
                  src="/bpo.png"
                  alt="BPO"
                  width={35}
                  height={35}
                  className="object-contain"
                />
              </div>
              <div className="text-center">
                <h2 className="text-[22px] font-normal text-black leading-tight">
                  BPO
                </h2>
                <p className="text-lg text-black">e-Passport Booking</p>
              </div>
              <div className="w-[35px] h-[35px] relative">
                <Image
                  src="/passport.png"
                  alt="Passport"
                  width={35}
                  height={35}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Issue Date */}
            <div className="text-center mb-3.5">
              <p className="text-lg text-gray-900">
                Issue Date : {getTodayDate()}
              </p>
            </div>

            {/* Barcode Section */}
            <div className="flex flex-col items-center mb-2">
              {barcodeInput ? (
                <>
                  <div className="barcode-container h-9 w-[350px] flex items-center justify-center">
                    <Barcode
                      value={barcodeInput}
                      height={35}
                      width={1.5}
                      displayValue={false}
                      background="#ffffff"
                    />
                  </div>
                  <p className="text-lg text-gray-900 mt-1.5">{barcodeInput}</p>
                </>
              ) : (
                <>
                  <div className="barcode-container h-9 w-[350px] flex items-center justify-center bg-gray-100 border border-gray-300 rounded">
                    <p className="text-gray-400 text-sm">
                      Scan or Enter Barcode
                    </p>
                  </div>
                  <p className="text-lg text-transparent mt-1.5">.</p>
                </>
              )}
            </div>

            {/* To Section */}
            <div className="w-full px-2.5 py-2.5">
              <p className="text-lg font-normal text-gray-900">To</p>
              <p className="text-lg font-normal text-gray-900">
                {selectedRPO.address}
              </p>
              <p className="text-lg font-normal text-gray-900">
                Phone: {selectedRPO.mobile}
              </p>
            </div>

            {/* From Section */}
            <div className="w-full px-2.5 py-2.5">
              <p className="text-lg font-bold text-gray-900">From</p>
              <p className="text-lg text-gray-900">
                Passport Personalization Complex
              </p>
              <p className="text-lg text-gray-900">
                Plot-4, Road-1, Sector-16(i), Diabari, Uttara
              </p>
              <p className="text-lg text-gray-900">Dhaka-1711</p>
            </div>
          </div>

          {/* Barcode Input (hidden but functional) */}
          <div className="h-10 w-full bg-white">
            <Input
              type="text"
              placeholder=""
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="w-full h-full border-0 text-transparent focus:border-0 focus:ring-0 bg-transparent"
              autoFocus
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-5">
            <Button
              variant="primary"
              className="h-[42px] w-[250px]"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="h-[42px] w-[250px]"
              onClick={onPrint}
              disabled={!barcodeInput}
            >
              Print
            </Button>
            <Button
              variant="primary"
              className="h-[42px] w-[250px]"
              onClick={handleScan}
              disabled={!!barcodeInput}
            >
              {isScanning ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Waiting For Scan</span>
                </span>
              ) : (
                "Scan"
              )}
            </Button>

            <Button
              variant="primary"
              className="h-[42px] w-[250px]"
              onClick={handleOk}
              disabled={!barcodeInput}
            >
              Ok
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeModal;
