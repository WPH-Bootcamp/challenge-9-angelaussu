// src/components/SocialIcons.tsx
import Facebook from "@/assets/facebook.svg";
import Instagram from "@/assets/instagram.svg";
import Linkedin from "@/assets/linkedin.svg";
import Tiktok from "@/assets/tiktok.svg";

const socials = [
  {
    name: "Facebook",
    icon: Facebook,
    url: "https://facebook.com",
  },
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://instagram.com",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://linkedin.com",
  },
  {
    name: "TikTok",
    icon: Tiktok,
    url: "https://tiktok.com",
  },
];

export default function SocialIcons() {
  return (
    <div className="flex items-center gap-3 mt-5">
      {socials.map((item) => (
        <a
          key={item.name}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.name}
          className="
            w-10 h-10
            flex items-center justify-center
            rounded-full
            border border-white/20
            hover:border-white/40
            hover:bg-white/10
            transition
          "
        >
          <img
            src={item.icon}
            alt={item.name}
            className="w-5 h-5 object-contain"
          />
        </a>
      ))}
    </div>
  );
}
