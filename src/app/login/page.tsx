"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Card } from "@/components/ui";
import { authApi } from "@/lib/api-services";
import { useAuthStore } from "@/store";
import { handleApiError } from "@/lib/error-handler";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role_id: "4", // Fixed role_id value
    deviceImei: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter Email and Password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.login(formData);

      // Check for success (case-insensitive)
      const isSuccess =
        response.status?.toLowerCase() === "success" ||
        response.status_code === "200";

      if (isSuccess) {
        // Create a token from user_id if not provided
        const authToken = response.token || response.user_id || "auth-success";

        // Add token to response
        const authData = { ...response, token: authToken };

        // Store auth data
        setAuth(authData);

        // Store token in cookie for middleware
        document.cookie = `auth-token=${authToken}; path=/; max-age=86400`;

        // Redirect to dashboard or specified page
        router.push(redirectUrl);
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bangladesh Post Office
          </h1>
          <p className="text-gray-600">ePassport Issuing Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>© 2026 Bangladesh Post Office. All rights reserved.</p>
        </div>
      </Card>
    </div>
  );
}
