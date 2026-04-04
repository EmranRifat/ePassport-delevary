"use client";

import { useState } from "react";
// import { Input } from "@/components/ui";
import { useAuthStore } from "@/store";
import { getAllAddress, RegionalPassportOffice } from "@/utils/address-util";
import BarcodeModal from "@/components/modals/barcode_modal";
import { useGetBarcodeData } from "@/lib/hooks/useGetBarcodeInfo";
import { useGetMissingBarcode } from "@/lib/hooks/useMisBarcode";
// import { useSubmitBookingData } from "@/lib/hooks/usePostBookingData";
import { BOOKING_BASE_PAYLOAD } from "./BookingBasePayload";
import Cookies from "js-cookie";
import { useSubmitEpassport } from "@/lib/hooks/useSubmitEpassport";
import { useGetBrtaBookingLicence } from "@/lib/hooks/useGetBookingSubmissionCheck";
import { useStoreMissingData } from "@/lib/hooks/useStoreMissingData";
import { Input } from "@heroui/react";

type ViewMode = "grid" | "list";
const token = Cookies.get("auth-token");
// const token = Cookies.get("access");

const BookingComponent = () => {
  // const router = useRouter();
  const { user } = useAuthStore();

  const {
    GetBarcodeInfo: postBarcode,
    loading: barcodeLoading,
    error: barcodeError,
    data: barcodeData,
  } = useGetBarcodeData();

  const { getMissingBarcode } = useGetMissingBarcode();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedRPO, setSelectedRPO] = useState<RegionalPassportOffice | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState("");
  const [bookingErrorMessage, setBookingErrorMessage] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");

  const allAddresses = getAllAddress();
  const filteredAddresses = allAddresses.filter(
    (address) =>
      address.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.code.includes(searchQuery),
  );

  const {
    storeMissingData,
    // loading: missingDataLoading,
    // error: missingDataError,
  } = useStoreMissingData(token);

  // handle RPO click button trigger  ============= //======== open modal and fetch barcode

  const handleRPOClick = async (address: RegionalPassportOffice) => {
    setSelectedRPO(address);
    setShowModal(true);

    try {
      const response = await postBarcode({
        user_id: user?.user_id || "",
        post_code: address.code,
      });

      console.log("barcode_data ===>", response);

      // Check if the response indicates an error (404 or success: false)
      if (!response.success || response.status_code === "404") {
        console.warn("Barcode fetch failed:", response.message);

        // Call getMissingBarcode hook with static values
        try {
          const res = await getMissingBarcode({
            user_id: "BTD001",
            user_pass: "Bp#tYe*",
            barcode_qty: 1,
            barcode_type: "DG",
          });

          console.log("Missing barcode response:", res);

          // Set the barcode from missing barcode response
          if (res?.barcode) {
            setBarcodeValue(res.barcode);

            // Call storeMissingData after getting missing barcode
            try {
              const storeRes = await storeMissingData({
                user_id: user?.user_id || "",
                insurance_id: "0",
                rpo_address: address.address,
                phone: address.mobile,
                post_code: address.code,
                rpo_name: address.name,
                barcode: res.barcode,
                booking_status: "Init",
              });

              console.log("Store missing data response:", storeRes);
            } catch (storeError) {
              console.error("Store missing data failed:", storeError);
            }
          }
        } catch (missingBarcodeError) {
          console.error("Error fetching missing barcode:", missingBarcodeError);
        }

        return;
      }

      if (response.barcode) {
        console.log("Barcode received:", response.barcode);
        setBarcodeValue(response.barcode);
      } else {
        console.warn("Barcode missing for this RPO");
      }
    } catch (error) {
      console.error("Error fetching barcode:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRPO(null);
    setBarcodeValue("");
    setBookingErrorMessage("");
    setBookingMessage("");
  };

  const handleScan = () => {
    // Toggle scanning state in modal
    console.log("Scan triggered");
  };

  // *****************submit Action after ok button in modal************//

  // first api call for booking submission

  // const { bookingBarcodeSubmit } = useSubmit BookingData(token);

  // second  api call for booking submission

  const {
    submitEpassport,
    loading,
    error,
    data: epassportData,
  } = useSubmitEpassport(token);
  // Third API Call for BRTA Booking Licence Check

  // console.log("E-passport data 333:", epassportData);

  const {
    getBrtaBookingLicence,
    loading: brtaLoading,
    error: brtaError,
    data: brtaData,
  } = useGetBrtaBookingLicence(token);






  // const handleOk = async (barcode: string) => {
  //   if (!barcode?.trim()) {
  //     setBookingErrorMessage("Barcode is required to submit.");
  //     return {
  //       success: false,
  //       status_code: "400",
  //       message: "Barcode is required",
  //     };
  //   }

  //   if (!selectedRPO) {
  //     setBookingErrorMessage("Please choose a RPO location before submitting.");
  //     return {
  //       success: false,
  //       status_code: "400",
  //       message: "No RPO selected",
  //     };
  //   }

  //   try {
  //     console.log(
  //       "handleOk invoked with barcode:",
  //       barcode,
  //       "selectedRPO:",
  //       selectedRPO,
  //     );

  //     const epassportRes = await submitEpassport({
  //       userId: user?.user_id || "",
  //       barcodeId: barcode.trim(),
  //       serviceType: "Parcel",
  //       itemWeight: BOOKING_BASE_PAYLOAD.item_weight,
  //       recName: selectedRPO.name || BOOKING_BASE_PAYLOAD.rec_name,
  //       recAddress: selectedRPO.address || BOOKING_BASE_PAYLOAD.rec_address,
  //       recPhoneNo: selectedRPO.mobile || BOOKING_BASE_PAYLOAD.rec_contact,
  //       token: token || "",
  //       cityPostStatus: BOOKING_BASE_PAYLOAD.city_post_status,
  //       shift: BOOKING_BASE_PAYLOAD.shift,
  //       hnddevice: BOOKING_BASE_PAYLOAD.hnddevice,
  //     });

  //     console.log("E-passport response 999:", epassportRes);

  //     setBookingMessage(
  //       epassportRes?.status === "Success"
  //         ? "E-passport submission successful"
  //         : epassportRes.status || "E-passport submission failed",
  //     );

  //     try {
  //       console.log("Step 3: Fetching BRTA booking licence...");
  //       const brtaRes = await getBrtaBookingLicence();
  //       console.log("BRTA booking licence data:", brtaRes);

  //       if (!brtaRes.success) {
  //         console.warn("BRTA API returned non-success:", brtaRes);
  //       }
  //     }
  //      catch (brtaErr) {
  //       console.error("BRTA booking licence check failed:", brtaErr);
  //     }

  //     // close modal after success so the UI does not hide before you can see toast
  //     setTimeout(() => {
  //       handleCloseModal();
  //     }, 5000);

  //     return epassportRes;

  //   } catch (epassportErr: any) {
  //     console.error("E-passport submission failed:", epassportErr);
  //     return {
  //       success: false,
  //       message: epassportErr?.message || "E-passport submission failed",
  //       status_code: "500",
  //     };
  //   }
  // };




const handleOk = async (barcode: string) => {
  setBookingErrorMessage("");
  setBookingMessage("");

  if (!barcode?.trim()) {
    const response = {
      success: false,
      status_code: "400",
      message: "Barcode is required",
    };

    setBookingErrorMessage(response.message);
    return response;
  }

  if (!selectedRPO) {
    const response = {
      success: false,
      status_code: "400",
      message: "Please choose a RPO location before submitting.",
    };

    setBookingErrorMessage(response.message);
    return response;
  }

  try {
    console.log(
      "handleOk invoked with barcode:",
      barcode,
      "selectedRPO:",
      selectedRPO,
    );

    const epassportRes = await submitEpassport({
      userId: user?.user_id || "",
      barcodeId: barcode.trim(),
      serviceType: "Parcel",
      itemWeight: BOOKING_BASE_PAYLOAD.item_weight,
      recName: selectedRPO.name || BOOKING_BASE_PAYLOAD.rec_name,
      recAddress: selectedRPO.address || BOOKING_BASE_PAYLOAD.rec_address,
      recPhoneNo: selectedRPO.mobile || BOOKING_BASE_PAYLOAD.rec_contact,
      token: token || "",
      cityPostStatus: BOOKING_BASE_PAYLOAD.city_post_status,
      shift: BOOKING_BASE_PAYLOAD.shift,
      hnddevice: BOOKING_BASE_PAYLOAD.hnddevice,
    });

    console.log("E-passport response 999:", epassportRes);

    const isSuccess =
      epassportRes?.success === true || epassportRes?.status === "Success";

    if (isSuccess) {
      setBookingMessage("E-passport submission successful");

      try {
        console.log("Step 3: Fetching BRTA booking licence...");
        const brtaRes = await getBrtaBookingLicence();
        console.log("BRTA booking licence data:", brtaRes);

        if (!brtaRes?.success) {
          console.warn("BRTA API returned non-success:", brtaRes);
        }
      } catch (brtaErr) {
        console.error("BRTA booking licence check failed:", brtaErr);
      }

      setTimeout(() => {
        handleCloseModal();
      }, 5000);
    } else {
      const failMessage =
        epassportRes?.message ||
        epassportRes?.status ||
        "E-passport submission failed";

      setBookingErrorMessage(failMessage);
    }

    return epassportRes;
  } catch (epassportErr: unknown) {
    const message =
      epassportErr instanceof Error
        ? epassportErr.message
        : "E-passport submission failed";

    console.error("E-passport submission failed:", epassportErr);

    const errorResponse = {
      success: false,
      message,
      status_code: "500",
    };

    setBookingErrorMessage(message);
    return errorResponse;
  }
};















  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      {/* Toast Notifications */}

      {/* Search Bar Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <h3 className="text-base md:text-md lg:text-2xl font-semibold  md:font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap">
              RPO Name
            </h3>

            <div className="flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Search by Name or RPO..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search RPO by Name or Code"
                startContent={
                  <svg
                    className="w-5 h-5 text-gray-400"
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
                  inputWrapper: [
                    "h-11",
                    "bg-white",
                    "dark:bg-gray-700",
                    "border",
                    "border-gray-300",
                    "dark:border-gray-600",
                    "hover:border-primary-500",
                    "focus-within:border-primary-500",
                    "rounded-lg",
                    "shadow-sm",
                    "!outline-none",
                    "focus-within:!outline-none",
                  ],
                  input: ["text-sm", "!outline-none", "focus:!outline-none"],
                }}
              />
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-2 md:px-4 py-1 md:py-2 text-sm font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-primary-600 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              }`}
            >
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
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>

            <button
              onClick={() => setViewMode("list")}
              className={`px-2 md:px-4 py-1 md:py-2 text-sm font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-primary-600 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              }`}
            >
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* RPO Grid */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {filteredAddresses.map((address) => (
            <button
              key={address.code}
              onClick={() => handleRPOClick(address)}
              className="bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 
                   hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-primary-500 transition-all duration-200 
                   text-left flex items-center space-x-3 group"
            >
              <span
                className="inline-flex items-center justify-center px-3 py-2
                          rounded-md
                          border border-primary-400
                          text-sm font-medium
                          text-primary-500
                          transition-colors
                          group-hover:border-primary-600
                          group-hover:text-primary-700
                          hover:-translate-y-0.5
                          hover:border-primary-500
                          hover:bg-primary-50 dark:hover:bg-primary-200
                          hover:shadow-md
                        "
              >
                {address.code}
              </span>

              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                {address.name.toLowerCase()}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* RPO List */}
      {viewMode === "list" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-200 dark:bg-gray-800 py-4">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    SL
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    RPO Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAddresses.map((address, index) => (
                  <tr
                    key={address.code}
                    className={
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-900/80 hover:bg-gray-100 hover:dark:bg-slate-600"
                        : "bg-gray-50/5 dark:bg-gray-900/50 hover:bg-gray-100 hover:dark:bg-slate-700"
                    }
                  >
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-semibold text-primary-500 dark:text-primary-600 border border-primary-300 dark:border-primary-600">
                        {address.code}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">
                        {address.name.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {address.address}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {address.mobile}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleRPOClick(address)}
                        className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 dark:bg-primary-450 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                      >
                        Book
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredAddresses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No RPO offices found matching your search.
          </p>
        </div>
      )}

      {/* Booking Modal */}
      <BarcodeModal
        barcodeLoading={barcodeLoading}
        barcodeError={barcodeError}
        status_code={barcodeData?.status_code}
        showModal={showModal}
        selectedRPO={selectedRPO}
        initialBarcode={barcodeValue}
        handleCloseModal={handleCloseModal}
        handleScan={handleScan}
        handleOk={handleOk}
        getTodayDate={getTodayDate}
        bookingErrorMessage={bookingErrorMessage}
        bookingSuccessMessage={bookingMessage}
      />
    </div>
  );
};

export default BookingComponent;
