"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui";
import { Sidebar } from "@/components/layout";
import { useAuthStore } from "@/store";
import { getAllAddress, RegionalPassportOffice } from "@/utils/address-util";
import Header from "@/components/header/header";
import BarcodeModal from "@/components/modals/barcode_modal";
import { usePostBarcode } from "@/lib/hooks/usePostBarcode";

export default function BookingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    postBarcode,
    loading: barcodeLoading,
    error: barcodeError,
  } = usePostBarcode();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRPO, setSelectedRPO] = useState<RegionalPassportOffice | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const allAddresses = getAllAddress();
  const filteredAddresses = allAddresses.filter(
    (address) =>
      address.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.code.includes(searchQuery)
  );

  const handleRPOClick = async (address: RegionalPassportOffice) => {
    setSelectedRPO(address);
    setShowModal(true);
    setBarcodeInput("");
    setIsScanning(true);

    try {
      // Call the barcode check API
      const response = await postBarcode({
        user_id: user?.user_id || "",
        post_code: address.code,
      });

      // If successful, set the barcode from response
      if (response.barcode) {
        setBarcodeInput(response.barcode);
      }
    } catch (error) {
      console.error("Error fetching barcode:", error);
      // Error is already set in the hook's error state
    } finally {
      setIsScanning(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRPO(null);
    setBarcodeInput("");
    setIsScanning(false);
  };

  const handleScan = () => {
    setIsScanning(true);
    // Add scan logic here
  };

  const handleOk = () => {
    if (barcodeInput.trim()) {
      // Process booking
      console.log(
        "Processing booking with barcode:",
        barcodeInput,
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
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">RPO Name</h3>
              <div className="w-96">
                <Input
                  type="text"
                  placeholder="Search by name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* RPO Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {filteredAddresses.map((address) => (
              <button
                key={address.code}
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 hover:border-primary-500 transition-all duration-200 text-left flex items-center space-x-3 group"
                onClick={() => handleRPOClick(address)}
              >
                <span className="inline-flex items-center justify-center px-2.5 py-1 border-2 border-gray-400 rounded text-sm font-medium text-gray-700 group-hover:border-primary-600 group-hover:text-primary-700">
                  {address.code}
                </span>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {address.name.toLowerCase()}
                </span>
              </button>
            ))}
          </div>

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
        showModal={showModal}
        selectedRPO={selectedRPO}
        barcodeInput={barcodeInput}
        setBarcodeInput={setBarcodeInput}
        isScanning={isScanning}
        handleCloseModal={handleCloseModal}
        handleScan={handleScan}
        handleOk={handleOk}
        getTodayDate={getTodayDate}
      />
    </div>
  );
}
