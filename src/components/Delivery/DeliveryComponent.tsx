"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input } from "@/components/ui";
import { useDeliveryStore } from "@/store";
import { licenseApi } from "@/lib/api-services";
import { handleApiError } from "@/lib/error-handler";
import { LicenseData } from "@/types";

const Delivery = () => {
  const router = useRouter();
  const { setCurrentDelivery } = useDeliveryStore();

  const [searchType, setSearchType] = useState<"license" | "nid" | "mobile">(
    "license"
  );
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [deliveryData, setDeliveryData] = useState<LicenseData | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setDeliveryData(null);

    if (!searchValue) {
      setError("Please enter a search value");
      return;
    }

    setIsLoading(true);

    try {
      const searchData: Record<string, string> = {};

      if (searchType === "license") {
        searchData.licenseNo = searchValue;
      } else if (searchType === "nid") {
        searchData.nid = searchValue;
      } else if (searchType === "mobile") {
        searchData.mobile = searchValue;
      }

      const response = await licenseApi.getLicenseData(searchData);

      if (response.status === "success" && response.data) {
        setDeliveryData(response.data);
        setCurrentDelivery(response.data);
      } else {
        setError(response.message || "No data found");
      }
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message || "An error occurred while searching");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen ">
      <header className="bg-white dark:bg-gray-700 shadow rounded-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center ">
          <h1 className="text-base md:text-lg lg:text-2xl font-semibold md:font-bold text-gray-900 dark:text-gray-100">
            Delivery Management
          </h1>
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card
          title="Search Delivery Information"
          subtitle="Search by license number, NID, or mobile number"
          className="bg-white dark:bg-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
        >
          <form onSubmit={handleSearch} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search By
              </label>
              <div className="flex space-x-4">
                {["license", "nid", "mobile"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center text-gray-700 dark:text-gray-300"
                  >
                    <input
                      type="radio"
                      name="searchType"
                      value={type}
                      checked={searchType === type}
                      onChange={(e) =>
                        setSearchType(
                          e.target.value as "license" | "nid" | "mobile"
                        )
                      }
                      className="mr-2 accent-primary-600 dark:accent-primary-400"
                    />
                    {type === "license" ? "License Number" : type.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>

            <Input
              label={`Enter ${
                searchType === "license"
                  ? "License Number"
                  : searchType === "nid"
                  ? "NID"
                  : "Mobile Number"
              }`}
              type="text"
              placeholder={`Enter ${searchType}`}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              required
              className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />

            <div className="flex justify-end">
              <Button
                size="sm"
                type="submit"
                variant="primary"
                isLoading={isLoading}
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
          </form>
        </Card>

        {deliveryData && (
          <Card title="Delivery Information" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["License Number", deliveryData.licenseNo],
                ["Name", deliveryData.name],
                ["NID", deliveryData.nid],
                ["Mobile", deliveryData.mobile],
                ["Address", deliveryData.address, "md:col-span-2"],
                ["Issue Date", deliveryData.issueDate],
                ["Expiry Date", deliveryData.expiryDate],
              ].map(([label, value, spanClass], index) => (
                <div key={index} className={spanClass ? spanClass : ""}>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {label}
                  </p>
                  <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                    {value || "N/A"}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button variant="primary">Update Delivery Status</Button>
              <Button variant="outline">Print</Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};
export default Delivery;
