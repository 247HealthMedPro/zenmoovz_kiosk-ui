import { baseApi } from "./baseApi";

function knockingGuidePath(productCode) {
  return `/api/kiosk/guide/knocking/${encodeURIComponent(String(productCode))}`;
}

export const knockingGuideApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getKnockingGuide: build.query({
      async queryFn(productCode, _api, _extraOptions, baseQuery) {
        const code = String(productCode || "").trim();
        if (!code) {
          return {
            error: {
              status: 400,
              data: { message: "Product code is required." },
            },
          };
        }
        const result = await baseQuery({
          url: knockingGuidePath(code),
          method: "GET",
        });
        if (result.error) {
          return { error: result.error };
        }
        const json = result.data;
        if (json?.status !== "SUCCESS" || json?.response == null) {
          return {
            error: {
              status: 422,
              data: {
                message: json?.message || "Knocking guide could not be loaded.",
              },
            },
          };
        }
        return { data: json.response };
      },
    }),
  }),
});

export const { useGetKnockingGuideQuery } = knockingGuideApi;
