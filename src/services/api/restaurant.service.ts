import api from "./axios";

export const getRecommendedRestaurants = async () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const res = await api.get(`${baseURL}/api/resto/recommended`);
  return res.data.data;
};

export const getRestaurantDetail = async (id: string) => {
  const res = await api.get(`/api/resto/${id}`);
  return res.data.data;
};
