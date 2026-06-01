import { baseApi } from "./baseApi";

const CATEGORIES_PATH = "/api/kiosk/recommendations/categories";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRecommendationCategories: build.query({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const result = await baseQuery({
          url: CATEGORIES_PATH,
          method: "GET",
        });
        if (result.error) {
          return { error: result.error };
        }
        const json = result.data;
        if (json?.status !== "SUCCESS" || !Array.isArray(json?.response)) {
          return {
            error: {
              status: 422,
              data: {
                message: json?.message || "Categories could not be loaded.",
              },
            },
          };
        }
        return { data: json.response };
      },
    }),
  }),
});

export const { useGetRecommendationCategoriesQuery } = categoriesApi;
