"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Button, Input } from "@/components/ui";
import { Sidebar } from "@/components/layout";
import { useAuthStore } from "@/store";
import { getAllAddress, RegionalPassportOffice } from "@/utils/address-util";

// Import Barcode dynamically to avoid SSR issues
const Barcode = dynamic(() => import("react-barcode"), { ssr: false });

export default function BookingPage() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
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

  const handleLogout = () => {
    clearAuth();
    document.cookie = "auth-token=; path=/; max-age=0";
    router.push("/login");
  };

  const handleRPOClick = (address: RegionalPassportOffice) => {
    setSelectedRPO(address);
    setShowModal(true);
    setBarcodeInput("");
    setIsScanning(false);
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
        <header className="bg-white shadow">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bangladesh Post Office
              </h1>
              <p className="text-sm text-gray-600">ePassport Issuing Portal</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || user?.user_id || "User"}
                </p>
                <p className="text-xs text-gray-600">Welcome</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

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
      {showModal && selectedRPO && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Booking Preview Card */}
              <div className="border-2 border-black rounded-lg p-6 mb-6">
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
                      <div className="h-9 w-[350px] flex items-center justify-center">
                        <Barcode
                          value={barcodeInput}
                          height={35}
                          width={1.5}
                          displayValue={false}
                          background="#ffffff"
                        />
                      </div>
                      <p className="text-lg text-gray-900 mt-1.5">
                        {barcodeInput}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="h-9 w-[350px] flex items-center justify-center bg-gray-100 border border-gray-300 rounded">
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

              {isScanning && (
                <div className="text-center my-2.5">
                  <p className="text-gray-900">Waiting For Scan</p>
                </div>
              )}

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
                  onClick={handleScan}
                  disabled={!!barcodeInput}
                >
                  {isScanning ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-10 w-10 p-2"
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
      )}
    </div>
  );
}
