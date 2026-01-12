"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input } from "@/components/ui";
import { passportApi } from "@/lib/api-services";
import { handleApiError } from "@/lib/error-handler";
import { PassportIssueData } from "@/types";

export default function PassportPage() {
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Passport Status</h1>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card
          title="Search Passport"
          subtitle="Enter passport number to check status"
        >
          <form onSubmit={handleSearch} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
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
            />

            <div className="flex justify-end">
              <Button type="submit" variant="primary" isLoading={isLoading}>
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
          </form>
        </Card>

        {passportData && (
          <Card title="Passport Details" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Passport Number</p>
                <p className="text-base font-medium text-gray-900">
                  {passportData.passportNo || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Applicant Name</p>
                <p className="text-base font-medium text-gray-900">
                  {passportData.applicantName || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Issue Date</p>
                <p className="text-base font-medium text-gray-900">
                  {passportData.issueDate || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Delivery Status</p>
                <p className="text-base font-medium text-gray-900">
                  {passportData.deliveryStatus || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tracking Number</p>
                <p className="text-base font-medium text-gray-900">
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
