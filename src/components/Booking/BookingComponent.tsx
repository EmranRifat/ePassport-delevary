"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui";
import { useAuthStore } from "@/store";
import { getAllAddress, RegionalPassportOffice } from "@/utils/address-util";
import BarcodeModal from "@/components/modals/barcode_modal";
import { useGetBarcodeData } from "@/lib/hooks/useGetBarcodeInfo";
import { useGetMissingBarcode } from "@/lib/hooks/useMisBarcode";
import { useSubmitBookingData } from "@/lib/hooks/usePostBookingData";
import { BOOKING_BASE_PAYLOAD } from "./BookingBasePayload";
import Cookies from "js-cookie";
import { useSubmitEpassport } from "@/lib/hooks/useSubmitEpassport";
import { useGetBrtaBookingLicence } from "@/lib/hooks/useGetBookingSubmissionCheck";
import { useStoreMissingData } from "@/lib/hooks/useStoreMissingData";

type ViewMode = "grid" | "list";
const token = Cookies.get("auth-token");

const BookingComponent = () => {
  const router = useRouter();
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
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState("");
  const [bookingErrorMessage, setBookingErrorMessage] = useState("");
  const [bookingSuccessMessage, setBookingSuccessMessage] = useState("");
  const allAddresses = getAllAddress();
  const filteredAddresses = allAddresses.filter(
    (address) =>
      address.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.code.includes(searchQuery)
  );

  const {
    storeMissingData,
    loading: missingDataLoading,
    error: missingDataError,
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
    setBookingSuccessMessage("");
  };

  const handleScan = () => {
    // Toggle scanning state in modal
    console.log("Scan triggered");
  };

  // *****************submit Action after ok button in modal************//

  // first api call for booking submission

  const {
    bookingBarcodeSubmit,
    loading: bookingLoading,
    error: bookingError,
  } = useSubmitBookingData(token);

  // second  api call for booking submission

  const { submitEpassport, loading, error } = useSubmitEpassport(token);

  // Third API Call for BRTA Booking Licence Check

  const {
    getBrtaBookingLicence,
    loading: brtaLoading,
    error: brtaError,
    data: brtaData,
  } = useGetBrtaBookingLicence(token);

  // const res = await getBrtaBookingLicence();

  // ===========================================================================
  // handle Ok button click in modal
  // ==========================================================================

  const handleOk = async (barcode: string) => {
    if (!barcode.trim()) return;

    try {
      const requestData = {
        ...BOOKING_BASE_PAYLOAD,
        user_id: user?.user_id || "",
        printed_item_id: barcode.trim(),
      };

      const response = await bookingBarcodeSubmit(requestData);

      // Check for errors in response
      if (!response.success || response.status_code !== "200") {
        const errorMessage =
          response.status || response.message || "Booking failed";
        setBookingErrorMessage(
          `${errorMessage} (Status Code: ${response.status_code || "Unknown"})`
        );
        console.error("Booking failed:", response);
        return;
      }

      if (response.success) {
        console.log(
          "Booking processed successfully:",
          response.item_id,
          "for RPO:",
          selectedRPO?.name
        );

        // Call submitEpassport after successful booking
        try {
          const epassportRes = await submitEpassport({
            user_id: user?.user_id || "",
            item_id: response.item_id || barcode.trim(), // 🔥 fallback
            total_charge: 0,
            service_type: "Parcel",
            vas_type: "GEP",
            price: 0,
            insured: 0,
            booking_status: "Booked",
          });

          console.log("E-passport response:", epassportRes);

          if (!epassportRes.success || epassportRes.status_code !== "200") {
            console.warn("E-passport API returned non-success:", epassportRes);
            handleCloseModal();
            return;
          }

          // Set success message only when status_code is 200
          setBookingSuccessMessage("E-passport submission successful");

          // Clear success message after 3 seconds
          setTimeout(() => {
            setBookingSuccessMessage("");
          }, 3000);

          console.log("E-passport submission successful");

          // Call getBrtaBookingLicence only if epassport was successful
          try {
            console.log("Step 3: Fetching BRTA booking licence...");
            const brtaRes = await getBrtaBookingLicence();
            console.log("BRTA booking licence data:", brtaRes);

            if (!brtaRes.success) {
              console.warn("BRTA API returned non-success:", brtaRes);
            }
          } catch (brtaErr) {
            console.error("BRTA booking licence check failed:", brtaErr);
          }
        } catch (epassportErr) {
          console.error("E-passport submission failed:", epassportErr);
        }

        handleCloseModal();
      }
    } catch (err) {
      console.error("Booking submission failed:", err);
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Toast Notifications */}

      {/* Main Content */}
      <main className="flex-1 max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <h3 className="text-xl font-bold text-gray-800 whitespace-nowrap">
                RPO Name
              </h3>

              {/* Search Input */}
              <div className="flex-1 max-w-md">
                <Input
                  type="text"
                  placeholder="Search by name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full shadow-sm"
                />
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
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
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-primary-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredAddresses.map((address) => (
              <button
                key={address.code}
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 hover:border-primary-500 transition-all  duration-200 text-left flex items-center space-x-3 group"
                onClick={() => handleRPOClick(address)}
              >
                <span
                  className="
                        inline-flex items-center justify-center
                        px-3 py-2
                        rounded-md
                        border border-primary-400
                        text-sm font-medium
                        text-primary-700
                        transition-colors
                        group-hover:border-primary-600
                        group-hover:text-primary-700
                        hover:-translate-y-0.5
                      hover:border-primary-500
                      hover:bg-primary-50
                        hover:shadow-md
                      "
                >
                  {address.code}
                </span>

                <span className="text-sm font-medium text-gray-900 capitalize">
                  {address.name.toLowerCase()}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* RPO List */}
        {viewMode === "list" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      SL
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      RPO Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Mobile
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAddresses.map((address, index) => (
                    <tr
                      key={address.code}
                      className="hover:bg-primary-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-semibold  text-primary-800 border ">
                          {address.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900 capitalize">
                          {address.name.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {address.address}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-700">
                          {address.mobile}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleRPOClick(address)}
                          className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
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
      </main>

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
        bookingSuccessMessage={bookingSuccessMessage}
      />
    </div>
  );
};

export default BookingComponent;
