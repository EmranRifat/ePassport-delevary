import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button, Input } from "@/components/ui";
import { RegionalPassportOffice } from "@/utils/address-util";
import { printBookingPreview } from "@/utils/print-booking";
import { usePrintServerRes } from "@/lib/hooks/usePrintServerRes";
import { useAuthStore } from "@/store/auth-store";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import ToastSuccess from "../Common/ToastSuccess";

// Import Barcode dynamically to avoid SSR issues
const Barcode = dynamic(() => import("react-barcode"), { ssr: false });

interface BarcodeModalProps {
  showModal: boolean;
  selectedRPO: RegionalPassportOffice | null;
  initialBarcode?: string;
  barcodeLoading?: boolean;
  barcodeError?: string | null;
  status_code?: number | string;
  handleCloseModal: () => void;
  handleScan: () => void;
  handleOk: (barcode: string) => void;
  getTodayDate: () => string;
  handlePrint?: () => void;
  bookingErrorMessage?: string;
  bookingSuccessMessage?: string;
}

const BarcodeModal: React.FC<BarcodeModalProps> = ({
  showModal,
  selectedRPO,
  initialBarcode,
  handleCloseModal,
  handleScan: externalHandleScan,
  handleOk: handleOk,
  status_code,
  barcodeLoading,
  barcodeError,
  getTodayDate,
  handlePrint,
  bookingErrorMessage,
  bookingSuccessMessage,
}) => {
  const { submitPrintStatusServer, loading: submitting } = usePrintServerRes();
  const [isPrinted, setIsPrinted] = React.useState(false);
  const [barcodeInput, setBarcodeInput] = React.useState("");
  const [scanBarcodeInput, setScanBarcodeInput] = React.useState("");
  const [isScanning, setIsScanning] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { user } = useAuthStore();
  //   console.log("initial Barcode ===>>", initialBarcode);

  // Reset all states when modal opens
  React.useEffect(() => {
    if (showModal) {
      // Reset all states for fresh start
      setBarcodeInput(initialBarcode || "");
      setScanBarcodeInput("");
      setIsScanning(false);
      setIsPrinted(false);
    }
  }, [showModal, initialBarcode]);

  // Update internal barcode when initialBarcode prop changes while modal is open
  React.useEffect(() => {
    if (showModal && initialBarcode) {
      setBarcodeInput(initialBarcode);
    }
  }, [initialBarcode, showModal]);

  // Auto-activate scanning when scanBarcodeInput has value
  React.useEffect(() => {
    if (scanBarcodeInput && !isScanning) {
      setIsScanning(true);
    }
  }, [scanBarcodeInput, isScanning]);

  // Auto-focus input when scanning mode is active (like focusNode in Flutter)
  React.useEffect(() => {
    if (isScanning && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isScanning]);

  // Auto-stop scanning when barcode is scanned
  React.useEffect(() => {
    if (scanBarcodeInput && scanBarcodeInput.length >= 13) {
      console.log("Barcode scan detected, length:", scanBarcodeInput.length);
      // Barcode has been scanned, stop scanning state
      const timer = setTimeout(() => {
        console.log("Scanning Barcode Input:", scanBarcodeInput);
        setBarcodeInput(scanBarcodeInput); // Copy to main barcode
        setIsScanning(false);
        externalHandleScan();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [scanBarcodeInput, externalHandleScan]);



  if (!showModal || !selectedRPO) {
    return null;
  }

  const onCancel = () => {
    setBarcodeInput("");
    setIsPrinted(false);
    handleCloseModal();
  };

  const onPrint = async () => {
    if (handlePrint) {
      handlePrint();
    } else {
      try {
        await submitPrintStatusServer({
          user_id: user?.user_id || "",
          barcode: barcodeInput,
          booking_status: "Pending",
        });

        // Print on success
        printBookingPreview({
          barcodeInput,
          selectedRPO,
          getTodayDate,
        });

        // Enable scan button after print
        setIsPrinted(true);
      } catch (error) {
        console.error("Failed to submit pending booking:", error);
        // Optionally show error message to user
      }
    }
  };

  const onRePrint = () => {
    // Re-print without submitting to server again
    printBookingPreview({
      barcodeInput,
      selectedRPO,
      getTodayDate,
    });
  };

  const onScan = () => {
    setIsPrinted(false);
    setScanBarcodeInput(""); // Clear scan input before new scan
    setIsScanning(true);
    externalHandleScan();
    // Focus input immediately for handheld scanner
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  };

  return (
    <>
      {bookingSuccessMessage && <ToastSuccess message={bookingSuccessMessage} />}

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Booking Preview Card */}
            <div
              id="booking-preview-card"
              className="border-2 border-black rounded-lg p-6 mb-6"
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
                  <h2 className="text-[22px] font-normal text-black leading-tight">
                    BPO
                  </h2>
                  <p className="text-lg text-black">e-Passport Booking</p>
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
                <p
                  className="text-md text-gray-900 dark:text-gray-100"
                >
                  Issue Date : {getTodayDate()}
                </p>
              </div>

              {/* Barcode Section */}
              <div className="flex flex-col items-center mb-2">
                {barcodeLoading ? (
                  <>
                    <div className="barcode-container h-9 w-[350px] flex items-center justify-center bg-gray-50 border border-gray-300 rounded">
                      <span className="flex items-center gap-2 text-primary-600">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
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
                        <span className="text-sm">Loading barcode...</span>
                      </span>
                    </div>
                    <p className="text-lg text-transparent mt-1.5">.</p>
                  </>
                ) : initialBarcode ? (
                  <>
                    <div className="barcode-container h-9 w-[350px] flex items-center justify-center">
                      <Barcode
                        value={initialBarcode}
                        height={55}
                        width={2.6}
                        displayValue={false}
                        background="#ffffff"
                      />
                    </div>
                    <p
                      className="text-lg text-gray-800 dark:text-gray-200 mt-1.5"
                    >
                      {initialBarcode}
                    </p>
                  </>
                ) : null}
              </div>

              {/* To Section */}
              <div className="w-full px-2.5 py-2.5">
                <p className="text-lg font-normal text-gray-900 dark:text-gray-100">To</p>
                <p className="text-lg font-normal text-gray-900 dark:text-gray-100">
                  {selectedRPO.address}
                </p>
                <p className="text-lg font-normal text-gray-900 dark:text-gray-100">
                  Phone: {selectedRPO.mobile}
                </p>
              </div>

              {/* From Section */}
              <div className="w-full px-2.5 py-2.5">
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">From</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">
                  Passport Personalization Complex
                </p>
                <p className="text-lg text-gray-900 dark:text-gray-100">
                  Plot-4, Road-1, Sector-16(i), Diabari, Uttara
                </p>
                <p className="text-lg text-gray-900 dark:text-gray-100">Dhaka-1711</p>
              </div>
            </div>

            {/* Barcode Input (visible only when scanning) */}
            {
              <div className="h-10 w-full bg-white dark:bg-gray-700 mb-4">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Ready to scan..."
                  value={scanBarcodeInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setScanBarcodeInput(value);
                    // Auto-activate scanning when data starts coming in
                    if (value && !isScanning) {
                      setIsScanning(true);
                    }
                  }}
                  className="w-full h-full border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-center text-lg font-semibold"
                  style={{
                    color: isScanning ? "blue" : "green",
                  }}
                  autoComplete="off"
                  autoFocus
                />
              </div>
            }

            {/*================ all buttons here ==================*/}

            {/* Booking Error Message Display */}
            {bookingErrorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg">
                <p className="text-red-700 text-sm font-medium text-center">
                  {bookingErrorMessage}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-5">
              <Button
                variant="primary"
                className="h-[42px] w-[250px]"
                onClick={onCancel}
              >
                Cancel
              </Button>

              {!isPrinted ? (
                <Button
                  variant="primary"
                  className="h-[42px] w-[250px]"
                  onClick={onPrint}
                  disabled={!barcodeInput || submitting}
                >
                  {submitting ? (
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
                      <span>Submitting...</span>
                    </span>
                  ) : (
                    "Print"
                  )}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  className="h-[42px] w-[250px]"
                  onClick={onRePrint}
                  disabled={!barcodeInput}
                >
                  Re-Print
                </Button>
              )}

              <Button
                variant="primary"
                className="h-[42px] w-[250px]"
                onClick={onScan}
                disabled={isScanning}
              >
                {isScanning && !scanBarcodeInput ? (
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
                    <span className="text-xs">Waiting For Scan</span>
                  </span>
                ) : (
                  "Scan"
                )}
              </Button>

              <Button
                variant="primary"
                className="h-[42px] w-[250px]"
                onClick={() => handleOk(barcodeInput)}
                disabled={!barcodeInput}
              >
                Ok
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BarcodeModal;
