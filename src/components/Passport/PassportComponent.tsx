"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input } from "@/components/ui";
import { passportApi } from "@/lib/api-services";
import { handleApiError } from "@/lib/error-handler";
import { PassportIssueData } from "@/types";

const PassportComponent=()=> {
  const router = useRouter();
  const [passportNo, setPassportNo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passportData, setPassportData] = useState<PassportIssueData | null>(
    null
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPassportData(null);

    if (!passportNo) {
      setError("Please enter passport number");
      return;
    }

    setIsLoading(true);

    try {
      const response = await passportApi.getPassportDetails(passportNo);
      if (response) {
        setPassportData(response as PassportIssueData);
      }
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message || "Failed to fetch passport details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div className="min-h-screen">
  <header className="bg-white dark:bg-gray-700 shadow rounded-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <h1 className="text-base md:text-lg lg:text-2xl font-semibold md:font-bold text-gray-900 dark:text-gray-100">
        Passport Status
      </h1>
      <Button size="sm" variant="outline" onClick={() => router.push("/dashboard")}>
        Back to Dashboard
      </Button>
    </div>
  </header>

  <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <Card
      title="Search Passport"
      subtitle="Enter passport number to check status"
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
    >
      <form onSubmit={handleSearch} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <Input
          label="Passport Number"
          type="text"
          placeholder="Enter passport number"
          value={passportNo}
          onChange={(e) => setPassportNo(e.target.value)}
          required
          className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500"
        />

        <div className="flex justify-end">
          <Button size="sm" type="submit" variant="primary" isLoading={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
      </form>
    </Card>

    {passportData && (
      <Card title="Passport Details" className="mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Passport Number</p>
            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
              {passportData.passportNo || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Applicant Name</p>
            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
              {passportData.applicantName || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Issue Date</p>
            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
              {passportData.issueDate || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Delivery Status</p>
            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
              {passportData.deliveryStatus || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tracking Number</p>
            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
              {passportData.trackingNumber || "N/A"}
            </p>
          </div>
        </div>
      </Card>
    )}
  </main>
</div>

  );
}

export default PassportComponent;