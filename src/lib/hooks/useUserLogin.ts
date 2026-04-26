import { LoginRequest, LoginResponse } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (formData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DMS_BASE_URL}/api/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      const isSuccess =
        String(data.status_code) === "200" &&
        data.status?.toLowerCase() === "success";

      if (!isSuccess) {
        throw new Error(data.message || "Invalid email or password");
      }

      return data;
    },
    retry: false,
    throwOnError: false,
  });
};