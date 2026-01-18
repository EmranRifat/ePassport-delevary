"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";
import { Input } from "@/components/ui";
import { useAuthStore } from "@/store";
import { getAllAddress, RegionalPassportOffice } from "@/utils/address-util";
import BarcodeModal from "@/components/modals/barcode_modal";
import { useGetBarcodeData } from "@/lib/hooks/useGetBarcodeInfo";
import { useGetMissingBarcode } from "@/lib/hooks/useMisBarcode";

type ViewMode = "grid" | "list";

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
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState("");

  const allAddresses = getAllAddress();
  const filteredAddresses = allAddresses.filter(
    (address) =>
      address.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.code.includes(searchQuery)
  );

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
  };

  const handleScan = () => {
    // Toggle scanning state in modal
    console.log("Scan triggered");
  };

  const handleOk = (barcode: string) => {
    if (barcode.trim()) {
      // Process booking
      console.log(
        "Processing booking with barcode:",
        barcode,
        "for RPO:",
        selectedRPO
      );
      handleCloseModal();
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
      {/* Main Content */}

      {/* Search Bar Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <h3 className="text-base md:text-md lg:text-2xl font-semibold  md:font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap">
              RPO Name
            </h3>
            {/* Search Input */}
            <div className="flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Search by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 md:h-10 lg:h-12 shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 border border-gray-300 dark:border-gray-600 rounded-md"
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
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 
                   hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-primary-400 transition-all duration-200 
                   text-left flex items-center space-x-3 group"
            >
              <span
                className="inline-flex items-center justify-center px-3 py-2
                          rounded-md
                          border border-primary-300
                          text-sm font-medium
                          text-primary-200
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
              <thead className="bg-gray-50 dark:bg-gray-700/50">
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
                      ? "bg-white dark:bg-gray-600/80 hover:bg-gray-100 hover:dark:bg-slate-600"
                      : "bg-gray-50/5 dark:bg-gray-800/70 hover:bg-gray-100 hover:dark:bg-slate-700"
                  }
                  >
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-semibold text-primary-800 dark:text-primary-400 border border-primary-400 dark:border-primary-600">
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
                        className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-primary-700 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
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
      />
    </div>
  );
};

export default BookingComponent;
