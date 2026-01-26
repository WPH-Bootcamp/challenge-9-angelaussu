import { Link } from "react-router-dom";
import { Button } from "./ui/Button";
import { useRecommendedRestaurants } from "@/hooks/useRecommendedRestaurants";
import Rating from "../assets/star.svg";

export default function Recommended() {
  const { data, isLoading } = useRecommendedRestaurants();
  const recomendations = data?.recommendations || [];

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  return (
    <section className="pt-6 pb-12 px-4 md:pt-0 md:pb-25 md:px-20 xl:px-30">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[24px] md:text-[28px] lg:text-[32px] font-extrabold text-black-alt">
          Recommended
        </h2>
        <Button variant="default" className="border-0! p-0! text-[#C12116]">
          See All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:gap-5 gap-4">
        {recomendations.map((item: any) => (
          <Link key={item.id} to={`/restaurant/${item.id}`} className="block">
            <div className="flex gap-4 rounded-xl bg-white p-3 md:p-4 shadow-[0_0_20px_0_rgba(203,202,202,0.25)] hover:shadow-md transition items-center">
              <img
                src={item.logo}
                alt={item.name}
                className="h-22.5 w-22.5 md:h-30 md:w-30 rounded-lg object-cover"
              />

              <div className="flex flex-col gap-1">
                <h3 className="font-extrabold text-[18px] text-black-alt">
                  {item.name}
                </h3>
                <div className="flex items-center gap-1 text-sm ">
                  <img src={Rating} alt="Rating" className="h-4 w-4" />{" "}
                  <span className="text-black-alt font-medium text-base">
                    {item.star}
                  </span>
                </div>
                <p className="text-black-alt text-base font-normal">
                  {item.place} · {item.distance} km
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
