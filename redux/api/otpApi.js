import { MOCK_VERIFY_OTP, MOBILE_DIGITS } from "@/lib/constants/kioskTheme";
import { apiSlice } from "./apiSlice";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const otpApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    sendOtp: build.mutation({
      async queryFn({ mobile }) {
        await delay(550);
        const digits = String(mobile || "").replace(/\D/g, "");
        if (digits.length !== MOBILE_DIGITS) {
          return {
            error: {
              status: 400,
              data: { message: "Enter a valid 10-digit mobile number" },
            },
          };
        }
        return { data: { success: true, expiresIn: 300 } };
      },
    }),
    verifyOtp: build.mutation({
      async queryFn({ mobile, otp }) {
        await delay(500);
        const digits = String(mobile || "").replace(/\D/g, "");
        if (digits.length !== MOBILE_DIGITS) {
          return {
            error: { status: 400, data: { message: "Invalid mobile" } },
          };
        }
        if (String(otp) !== MOCK_VERIFY_OTP) {
          return {
            error: {
              status: 400,
              data: { message: "Invalid OTP. Try 123456 for demo." },
            },
          };
        }
        return {
          data: {
            success: true,
            sessionId: `mock-${digits}-${Date.now()}`,
          },
        };
      },
    }),
  }),
});

export const { useSendOtpMutation, useVerifyOtpMutation } = otpApi;
