"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Card } from "@/components/ui";
import { authApi } from "@/lib/api-services";
import { useAuthStore } from "@/store";
import { handleApiError } from "@/lib/error-handler";
import { LoginResponse, DmsLoginResponse, DmsLoginRequest } from "@/types";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role_id: "4",
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

  // First login API call
  const performInitialLogin = async (): Promise<LoginResponse> => {
    const response = await authApi.login(formData);
    console.log("First-login response:", response);

    // Check for success (case-insensitive)
    const isSuccess =
      response.status?.toLowerCase() === "success" ||
      response.status_code === "200";

    console.log("isSuccess check:", isSuccess);
    console.log("response.status:", response.status);
    console.log("response.status_code:", response.status_code);
    console.log("response.user_id:", response.user_id);

    if (!isSuccess) {
      throw new Error(response.status || "Login failed. Please try again.");
    }

    if (!response.user_id) {
      throw new Error("User ID not found in response");
    }

    console.log(
      "performInitialLogin completed successfully, returning response",
    );
    return response;
  };

  // DMS login API call
  const performDmsLogin = async (
    initialResponse: LoginResponse,
  ): Promise<DmsLoginResponse> => {
    console.log("initialResponse:", initialResponse);

    const dmsLoginData: DmsLoginRequest = {
      user_id: initialResponse.user_id || "",
      password: initialResponse.user_password || "",
      user_group: initialResponse.user_group || "",
      hnddevice: initialResponse.hnddevice || "",
    };

    console.log("DMS-login request data:", dmsLoginData);

    const dmsResponse = await authApi.dmsLogin(dmsLoginData);

    // Check DMS login success
    const isDmsSuccess =
      dmsResponse.status?.toLowerCase() === "success" ||
      dmsResponse.status_code === "200";

    if (!isDmsSuccess) {
      throw new Error("DMS authentication failed. Please try again.");
    }

    if (!dmsResponse.token) {
      throw new Error("Token not found in DMS response");
    }

    return dmsResponse;
  };

  // Combine and store auth data
  const saveAuthData = (
    initialResponse: LoginResponse,
    // dmsResponse: DmsLoginResponse,
  ) => {
    const authData = {
      ...initialResponse,
      // token: dmsResponse.token,
      // branch_code: dmsResponse.branch_code,
      // my_emts_branch_code: dmsResponse.my_emts_branch_code,
      // rms_code: dmsResponse.rms_code,
      // shift: dmsResponse.shift,
      // city_post_status: dmsResponse.city_post_status,
    };

    // Store auth data in store
    setAuth(authData);

    // Store token and user_id in cookies for middleware
    document.cookie = `auth-token=${initialResponse.token}; path=/; max-age=86400`;
    document.cookie = `user_id=${initialResponse.user_id}; path=/; max-age=86400`;
    document.cookie = `branch_code=${
      initialResponse.apiresponse.branch_code || ""
    }; path=/; max-age=86400`;
    document.cookie = `my_emts_branch_code=${
      initialResponse.apiresponse.my_emts_branch_code || ""
    }; path=/; max-age=86400`;
    document.cookie = `rms_code=${
      initialResponse.apiresponse.rms_code || ""
    }; path=/; max-age=86400`;
    document.cookie = `shift=${initialResponse.apiresponse.shift || ""}; path=/; max-age=86400`;
    document.cookie = `city_post_status=${
      initialResponse.apiresponse.city_post_status || ""
    }; path=/; max-age=86400`;
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
      // Step 1: Perform initial login
      const initialResponse = await performInitialLogin();

      // Step 2: Perform DMS login
      // const dmsResponse = await performDmsLogin(initialResponse);

      // Step 3: Save auth data
      saveAuthData(initialResponse );

      // Step 4: Redirect to dashboard or specified page
      router.push(redirectUrl);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
     

      <Card className="relative w-full max-w-md backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/60 shadow-2xl rounded-2xl p-2 md:p-6 transition-all duration-300">
        <div className="flex justify-center mb-4">
          <Image
            src="/bpo.png"
            alt="Bangladesh Post Office Logo"
            width={80}
            height={80}
            priority
            className="object-contain"
          />
        </div>

        <div className="text-center mb-8 space-y-2">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Bangladesh Post Office
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            ePassport Issuing Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter your email or phone number"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
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
            className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            isLoading={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
          {error && (
            <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-500 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm">
              <span className="font-semibold">Error :</span>
              <span>{error}</span>
            </div>
          )}
        </form>

        <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>© 2026 Bangladesh Post Office. All rights reserved.</p>
        </div>
      </Card>
    </div>
  );
}
