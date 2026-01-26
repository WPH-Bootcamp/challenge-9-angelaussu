import { useQuery } from "@tanstack/react-query";
import { getRestaurantDetail } from "@/services/api/restaurant.service";
import { getRecommendedRestaurants } from "@/services/api/restaurant.service";

export const useRestaurantDetail = (id?: string) => {
  return useQuery({
    queryKey: ["restaurant-detail", id],
    queryFn: () => getRestaurantDetail(id!),
    enabled: !!id,
  });
};

export const useRecommendedRestaurants = () => {
  return useQuery({
    queryKey: ["recommended-restaurants"],
    queryFn: getRecommendedRestaurants,
  });
};
