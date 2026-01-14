"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui";
import { useAuthStore } from "@/store";
import {
  getAllAddress,
  RegionalPassportOffice,
} from "@/utils/address-util";
import BarcodeModal from "@/components/modals/barcode_modal";
import { usePostBarcode } from "@/lib/hooks/usePostBarcode";

type ViewMode = "grid" | "list";

const  BookingComponent= ()=> {
  const { user } = useAuthStore();
  const { postBarcode } = usePostBarcode();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const [selectedRPO, setSelectedRPO] =
    useState<RegionalPassportOffice | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);

 
  const filteredAddresses = useMemo(() => {
    return getAllAddress().filter(
      (address) =>
        address.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        address.code.includes(searchQuery)
    );
  }, [searchQuery]);

  
  const handleRPOClick = async (address: RegionalPassportOffice) => {
    setSelectedRPO(address);
    setShowModal(true);
    setBarcodeInput("");
    setIsScanning(true);

    try {
      const response = await postBarcode({
        user_id: user?.user_id ?? "",
        post_code: address.code,
      });

      if (response?.barcode) {
        setBarcodeInput(response.barcode);
      }
    } catch (err) {
      console.error("Barcode fetch failed", err);
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

  const getTodayDate = () =>
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

 
  return (
    <>
      <main className="max-w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Search & View Toggle */}
        <section className="bg-white rounded-lg border p-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-800">
              RPO Offices
            </h3>

            <Input
              placeholder="Search by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* View Switch */}
          <div className="flex border rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 text-sm ${
                viewMode === "grid"
                  ? "bg-primary-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 text-sm ${
                viewMode === "list"
                  ? "bg-primary-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              List
            </button>
          </div>
        </section>

        {/* GRID VIEW */}
        {viewMode === "grid" && (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredAddresses.map((address) => (
              <button
                key={address.code}
                onClick={() => handleRPOClick(address)}
                className="bg-white border rounded-lg px-4 py-3 flex items-center gap-3
                  hover:border-primary-500 hover:shadow-sm transition"
              >
                <span className="px-3 py-1.5 rounded border text-sm font-semibold text-primary-700">
                  {address.code}
                </span>
                <span className="text-sm font-medium capitalize">
                  {address.name.toLowerCase()}
                </span>
              </button>
            ))}
          </section>
        )}

        {/* LIST VIEW */}
        {viewMode === "list" && (
          <section className="bg-white border rounded-lg overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["SL", "Code", "RPO Name", "Address", "Mobile", "Action"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left font-semibold text-gray-700"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredAddresses.map((address, index) => (
                  <tr
                    key={address.code}
                    className="hover:bg-primary-50"
                  >
                    <td className="px-6 py-3">{index + 1}</td>
                    <td className="px-6 py-3">{address.code}</td>
                    <td className="px-6 py-3 capitalize">
                      {address.name.toLowerCase()}
                    </td>
                    <td className="px-6 py-3">{address.address}</td>
                    <td className="px-6 py-3">{address.mobile}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleRPOClick(address)}
                        className="px-4 py-1.5 text-white bg-primary-600 rounded hover:bg-primary-700"
                      >
                        Book
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {filteredAddresses.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            No RPO offices found.
          </p>
        )}
      </main>

      {/* MODAL */}
      <BarcodeModal
        showModal={showModal}
        selectedRPO={selectedRPO}
        barcodeInput={barcodeInput}
        setBarcodeInput={setBarcodeInput}
        isScanning={isScanning}
        handleCloseModal={handleCloseModal}
        handleScan={() => setIsScanning(true)}
        handleOk={handleCloseModal}
        getTodayDate={getTodayDate}
      />
    </>
  );
}
export default BookingComponent;