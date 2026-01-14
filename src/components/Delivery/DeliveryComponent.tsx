"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input } from "@/components/ui";
import { useDeliveryStore } from "@/store";
import { licenseApi } from "@/lib/api-services";
import { handleApiError } from "@/lib/error-handler";
import { LicenseData } from "@/types";

const Delivery = ()=> {
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Delivery Management
          </h1>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card
          title="Search Delivery Information"
          subtitle="Search by license number, NID, or mobile number"
        >
          <form onSubmit={handleSearch} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search By
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchType"
                    value="license"
                    checked={searchType === "license"}
                    onChange={(e) =>
                      setSearchType(
                        e.target.value as "license" | "nid" | "mobile"
                      )
                    }
                    className="mr-2"
                  />
                  License Number
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchType"
                    value="nid"
                    checked={searchType === "nid"}
                    onChange={(e) =>
                      setSearchType(
                        e.target.value as "license" | "nid" | "mobile"
                      )
                    }
                    className="mr-2"
                  />
                  NID
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchType"
                    value="mobile"
                    checked={searchType === "mobile"}
                    onChange={(e) =>
                      setSearchType(
                        e.target.value as "license" | "nid" | "mobile"
                      )
                    }
                    className="mr-2"
                  />
                  Mobile
                </label>
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
            />

            <div className="flex justify-end">
              <Button type="submit" variant="primary" isLoading={isLoading}>
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
          </form>
        </Card>

        {deliveryData && (
          <Card title="Delivery Information" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">License Number</p>
                <p className="text-base font-medium text-gray-900">
                  {deliveryData.licenseNo || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-base font-medium text-gray-900">
                  {deliveryData.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">NID</p>
                <p className="text-base font-medium text-gray-900">
                  {deliveryData.nid || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mobile</p>
                <p className="text-base font-medium text-gray-900">
                  {deliveryData.mobile || "N/A"}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Address</p>
                <p className="text-base font-medium text-gray-900">
                  {deliveryData.address || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Issue Date</p>
                <p className="text-base font-medium text-gray-900">
                  {deliveryData.issueDate || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expiry Date</p>
                <p className="text-base font-medium text-gray-900">
                  {deliveryData.expiryDate || "N/A"}
                </p>
              </div>
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
}
export default Delivery ;