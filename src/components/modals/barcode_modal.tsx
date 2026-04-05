import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button, Input } from "@/components/ui";
import { printBookingPreview } from "@/utils/print-booking";
import { usePrintServerRes } from "@/lib/hooks/usePrintServerRes";
import { useAuthStore } from "@/store/auth-store";
import ToastSuccess from "../Common/ToastSuccess";
import { BarcodeModalProps } from "@/lib/types";
import { formatAddressLines } from "@/utils/address-util";

// Import Barcode dynamically to avoid SSR issues
const Barcode = dynamic(() => import("react-barcode"), { ssr: false });

const BarcodeModal: React.FC<BarcodeModalProps> = ({
  showModal,
  selectedRPO,
  initialBarcode,
  handleCloseModal,

  handleScan: externalHandleScan,
  handleOk: handleOk,
  barcodeLoading,
  getTodayDate,
  bookingSuccessMessage,
  bookingErrorMessage,
}) => {
  const { submitPrintStatusServer, loading: submitting } = usePrintServerRes();
  const [isPrinted, setIsPrinted] = React.useState(false);
  const [isPrintTrigger, setIsPrintTrigger] = React.useState(false);
  const [barcodeInput, setBarcodeInput] = React.useState("");
  const [scanBarcodeInput, setScanBarcodeInput] = React.useState("");
  const [isScanning, setIsScanning] = React.useState(false);
  const [isScanSuccess, setIsScanSuccess] = React.useState(false);

  const [scanSuccessToast, setScanSuccessToast] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [showScanButton, setShowScanButton] = React.useState(false);
  const [okCountdown, setOkCountdown] = React.useState(5); // 5 seconds countdown
  const [showSuccessToast, setShowSuccessToast] = React.useState(false);
  const [showErrorToast, setShowErrorToast] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { user } = useAuthStore();
  //   console.log("initial Barcode ===>>", initialBarcode);

  const autoOkTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (showModal) {
      setBarcodeInput(initialBarcode || "");
      setScanBarcodeInput("");
      setIsScanning(false);
      setIsScanSuccess(false);
      setIsPrinted(false);
      setIsPrintTrigger(false);
      setShowScanButton(false);
      setOkCountdown(5);
      setIsSubmitted(false);
      if (autoOkTimerRef.current) {
        clearInterval(autoOkTimerRef.current);
        autoOkTimerRef.current = null;
      }
      setScanSuccessToast("");
    }
  }, [showModal, initialBarcode]);

  // console.log("isSubmitted -----",isSubmitted)

  // Auto-focus input when scanning mode is active (like focusNode in Flutter)
  React.useEffect(() => {
    if (isScanning && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isScanning]);

  // Auto-stop scanning when barcode is scanned
  React.useEffect(() => {
    if (scanBarcodeInput && scanBarcodeInput.length >= 13) {
      const timer = setTimeout(() => {
        setBarcodeInput(scanBarcodeInput);
        setIsScanning(false);
        setIsScanSuccess(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [scanBarcodeInput]);

  // 👉 NEW EFFECT
  React.useEffect(() => {
    if (isScanSuccess) {
      externalHandleScan(); // ✅ safe now
    }
  }, [isScanSuccess]);

  // Show in-modal scan toast
  React.useEffect(() => {
    if (isScanSuccess) {
      setScanSuccessToast("Scan successful!");
      const toastTimer = setTimeout(() => {
        setScanSuccessToast("");
      }, 1000);
      return () => clearTimeout(toastTimer);
    }
  }, [isScanSuccess]);

  // React.useEffect(() => {
  //   if (isScanSuccess && !isSubmitted) {
  //     setOkCountdown(5); // reset countdown on new scan

  //     const timer = setInterval(() => {
  //       setOkCountdown((prev) => {
  //         if (prev <= 1) {
  //           clearInterval(timer);
  //           setIsSubmitted(true); // stop repeat
  //           // Schedule handleSubmitOk to run after render using queueMicrotask
  //           queueMicrotask(() => {
  //             handleSubmitOk();
  //           });
  //           return 0;
  //         }
  //         return prev - 1;
  //       });
  //     }, 1000);

  //     autoOkTimerRef.current = timer;

  //     return () => {
  //       clearInterval(timer);
  //       autoOkTimerRef.current = null;
  //     };
  //   }
  // }, [isScanSuccess, isSubmitted]);

  React.useEffect(() => {
    if (isScanSuccess && !isSubmitted) {
      setOkCountdown(5);

      const timer = setInterval(() => {
        setOkCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsSubmitted(true);
            queueMicrotask(() => {
              handleSubmitOk();
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      autoOkTimerRef.current = timer;

      return () => {
        clearInterval(timer);
        autoOkTimerRef.current = null;
      };
    }
  }, [isScanSuccess, isSubmitted]);

  React.useEffect(() => {
    if (bookingSuccessMessage) {
      setShowSuccessToast(true);
      setShowErrorToast(false);

      const timer = setTimeout(() => {
        setShowSuccessToast(false);
        handleCloseModal();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [bookingSuccessMessage, handleCloseModal]);

  React.useEffect(() => {
    if (bookingErrorMessage) {
      setShowErrorToast(true);
      setShowSuccessToast(false);

      const timer = setTimeout(() => {
        setShowErrorToast(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [bookingErrorMessage]);

  // React.useEffect(() => {
  //   if (isSubmitted) {
  //     setTimeout(() => {
  //       handleCloseModal();
  //     }, 500);
  //   }
  // }, [isSubmitted]);

  if (!showModal || !selectedRPO) {
    return null;
  }

  const onCancel = () => {
    setBarcodeInput("");
    setIsPrinted(false);
    setScanSuccessToast("");
    setShowScanButton(false); // Reset
    setIsScanning(false);
    setIsScanSuccess(false);
    if (autoOkTimerRef.current) {
      clearInterval(autoOkTimerRef.current);
      autoOkTimerRef.current = null;
    }
    handleCloseModal();
  };

  // Handle print action - submit to server, then print on success
  const onPrint = async () => {
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
      setIsPrintTrigger(true);
      setShowScanButton(true);
    } catch (error) {
      console.error("Failed to submit pending booking:", error);
      // Optionally show error message to user
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
    setScanBarcodeInput(""); // Clear scan input before new scan
    setIsScanSuccess(false);
    setIsScanning(true);
    setIsPrinted(true);

    setIsPrintTrigger(false); // Keep Cancel button active during scan
    // Focus input immediately for handheld scanner
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  };

  const handleBarcodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Track scanner value internally using full typed value
    setScanBarcodeInput(value);

    // Auto-activate scanning when data starts coming in
    if (value && !isScanning) {
      setIsScanning(true);
    }
  };

  const handleInputBlur = () => {
    // When cursor leaves input, show scan button again
    setIsScanning(false);
  };

  // const handleSubmitOk = async () => {
  //   if (isSubmitted) return; // ✅ prevent double submit

  //   try {
  //     setIsSubmitted(true); // ✅ stop countdown

  //     if (autoOkTimerRef.current) {
  //       clearInterval(autoOkTimerRef.current);
  //       autoOkTimerRef.current = null;
  //     }

  //     setOkCountdown(0);

  //     await handleOk(barcodeInput);

  //     setShowSuccessToast(true);

  //     setTimeout(() => {
  //       setShowSuccessToast(false);
  //       setTimeout(() => {
  //         handleCloseModal();
  //       }, 0);
  //     }, 1500);
  //   } catch (error) {
  //     console.error("Submit failed:", error);
  //   }
  // };

  const handleSubmitOk = async () => {
    if (isSubmitting || isSubmitted) return;

    try {
      setIsSubmitting(true);

      if (autoOkTimerRef.current) {
        clearInterval(autoOkTimerRef.current);
        autoOkTimerRef.current = null;
      }

      setOkCountdown(0);

      await handleOk(barcodeInput);

      setIsSubmitted(true);
    } catch (error) {
      console.error("Submit failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatedAddress = formatAddressLines(selectedRPO.address).map(
    (line, index) => <p key={index}>{line}</p>,
  );

  return (
    <>
      {showSuccessToast && (
        <ToastSuccess
          message={bookingSuccessMessage || "Booking successful!"}
        />
      )}

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-900 dark:text-gray-100 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 ">
            <div
              id="booking-preview-card"
              className="border-2 border-black dark:border-gray-700 rounded-lg p-6 mb-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <Image src="/bpo.png" alt="BPO" width={45} height={45} />

                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-black dark:text-white">BPO</h2>
                  <p className="text-base font-semibold text-gray-600 dark:text-gray-300">
                    e-Passport Booking
                  </p>
                </div>

                <Image
                  src="/passport.png"
                  alt="Passport"
                  width={45}
                  height={45}
                />
              </div>

              {/* Main Content Wrapper (IMPORTANT 🔥) */}
              <div className="pl-8 ">
                {/* Issue Date */}
                <div className="mb-4 pl-2">
                  <p className="text-gray-900 dark:text-gray-100 text-base">
                    Issue Date : {getTodayDate()}
                  </p>
                </div>

                {/* Barcode */}
                <div className="mb-5">
                  {barcodeLoading ? (
                    <div className="h-10 w-[260px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 border rounded">
                      <span className="text-sm text-primary">
                        Loading barcode...
                      </span>
                    </div>
                  ) : initialBarcode ? (
                    <>
                      <div className="w-[260px]">
                        <Barcode
                          value={initialBarcode}
                          format="CODE128"
                          height={55}
                          width={2.6}
                          displayValue={false}
                          background="#ffffff"
                        />
                      </div>

                      <p className="font-semibold text-gray-800 dark:text-gray-100 ml-36">
                        {initialBarcode}
                      </p>
                    </>
                  ) : null}
                </div>

                {/* To */}
                <div className="mb-4 pl-2 text-xl">
                  <p className=" text-gray-900 dark:text-gray-100">To</p>
                  <span className="text-gray-900 dark:text-gray-100">
                    {formatedAddress}
                  </span>

                  <p className="text-gray-900 dark:text-gray-100">
                    Phone: {selectedRPO.mobile}
                  </p>
                </div>

                {/* From */}
                <div className="pl-2 text-xl">
                  <p className=" text-gray-900 dark:text-gray-100">From</p>
                  <p className="text-gray-900 dark:text-gray-100">
                    Passport Personalization Complex
                  </p>
                  <p className="text-gray-900 dark:text-gray-100">
                    Plot-4, Road-1, Sector-16(i), Diabari, Uttara
                  </p>
                  <p className="text-gray-900 dark:text-gray-100">Dhaka-1711</p>
                </div>
              </div>
            </div>

            {/* Barcode Input hidden from UI, still used for scanner capture */}
            {
              // className="absolute opacity-0 pointer-events-none"
              <div className="absolute opacity-0 pointer-events-none">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Ready to scan..."
                  value={scanBarcodeInput}
                  onChange={handleBarcodeInputChange}
                  onBlur={handleInputBlur}
                  className="w-full h-full border border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-center text-lg font-semibold dark:bg-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  autoComplete="off"
                  autoFocus
                />
              </div>
            }

            {scanSuccessToast && (
              <p className="mb-4 p-2 w-full text-center text-sm text-green-700 rounded bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700">
                {scanSuccessToast}
              </p>
            )}

            {/*================ all buttons here ==================*/}

            {/* Booking success/Error Message Display */}

            {bookingSuccessMessage && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
                <p className="text-green-700 dark:text-green-400 text-sm font-medium text-center">
                  ✅ Booking successful..!
                </p>
              </div>
            )}

            {bookingErrorMessage && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                <p className="text-red-700 dark:text-red-400 text-sm font-medium text-center">
                  ❌ {bookingErrorMessage}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-5">
              <Button
                variant="primary"
                className="h-[42px] w-[250px]"
                onClick={onCancel}
                disabled={isPrintTrigger}
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
              ) : !isScanSuccess ? (
                <Button
                  variant="primary"
                  className="h-[42px] w-[250px]"
                  onClick={onRePrint}
                  disabled={!barcodeInput || isScanning}
                >
                  Re-Print
                </Button>
              ) : null}
              {showScanButton && !isScanSuccess && (
                <Button
                  variant="primary"
                  className="h-[42px] w-[250px]"
                  onClick={onScan}
                  disabled={isScanning}
                >
                  {isScanning && !scanBarcodeInput.length ? (
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
              )}

              {isScanSuccess && (
                <Button
                  variant="primary"
                  className="h-[42px] w-[250px]"
                  onClick={handleSubmitOk}
                  disabled={isSubmitting || isSubmitted}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : `Ok ${okCountdown > -1 ? `(${okCountdown})` : ""}`}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BarcodeModal;
