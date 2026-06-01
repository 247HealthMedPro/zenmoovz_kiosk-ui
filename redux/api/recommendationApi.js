import { apiSlice } from "./apiSlice";

const BATS_PATH = "/api/kiosk/recommendations/bats";

export const recommendationApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    postBatsRecommendations: build.mutation({
      invalidatesTags: ["Recommendation"],
      async queryFn(body, _api, _extraOptions, baseQuery) {
        const result = await baseQuery({
          url: BATS_PATH,
          method: "POST",
          body,
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
                message:
                  json?.message || "Recommendations could not be loaded.",
              },
            },
          };
        }
        return { data: json.response };
      },
    }),
  }),
});

export const { usePostBatsRecommendationsMutation } = recommendationApi;
