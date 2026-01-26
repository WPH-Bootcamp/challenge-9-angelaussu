import all from "@/assets/all-restaurant.svg";
import nearby from "@/assets/location.svg";
import discount from "@/assets/discount.svg";
import bestSeller from "@/assets/best-seller.svg";
import delivery from "@/assets/delivery.svg";
import lunch from "@/assets/lunch.svg";

const categories = [
  { label: "All Restaurant", icon: all },
  { label: "Nearby", icon: nearby },
  { label: "Discount", icon: discount },
  { label: "Best Seller", icon: bestSeller },
  { label: "Delivery", icon: delivery },
  { label: "Lunch", icon: lunch },
];

export default function CategoryMenu() {
  return (
    <section
      className=" grid grid-cols-3 gap-6
  md:grid-cols-3 md:gap-8
  lg:grid-cols-3 lg:gap-11.5
  xl:grid-cols-6 xl:gap-11.5 pt-6 pb-6 px-4 md:pt-8 md:pb-8 md:px-20 lg:pt-20 lg:pb-12 lg:px-20 xl:px-30 xl:pb-12"
    >
      {categories.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center gap-1.5 cursor-pointer"
        >
          <div className="flex items-center justify-center rounded-2xl bg-white shadow-sm p-1 xl:py-4.25 xl:px-12 w-full">
            <img src={item.icon} alt={item.label} className="h-11.25 w-11.25" />
          </div>
          <span
            className="font-bold text-black-alt text-[14px]
  md:text-[16px]
  lg:text-[18px] text-center"
          >
            {item.label}
          </span>
        </div>
      ))}
    </section>
  );
}
