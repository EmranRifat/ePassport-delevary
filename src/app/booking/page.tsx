"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui";
import { Sidebar } from "@/components/layout";
import { useAuthStore } from "@/store";
import { getAllAddress, RegionalPassportOffice } from "@/utils/address-util";
import Header from "@/components/header/header";
import BarcodeModal from "@/components/modals/barcode_modal";
import { useGetBarcodeData } from "@/lib/hooks/useGetBarcodeInfo";
import { useGetMissingBarcode } from "@/lib/hooks/useMisBarcode";

type ViewMode = "grid" | "list";

export default function BookingPage() {
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
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
      </div>

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
}
