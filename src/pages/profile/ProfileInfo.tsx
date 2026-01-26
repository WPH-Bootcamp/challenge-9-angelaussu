import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ProfilePlaceholder from "@/assets/profile-default.png";

export default function ProfileInfo() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <h1 className="text-2xl font-extrabold text-black-alt mb-6">Profile</h1>

      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-8 max-w-180">
        <div className="flex items-center gap-5 mb-8">
          <img
            src={user?.avatar || ProfilePlaceholder}
            alt={user?.name || "User"}
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>

        <div className="space-y-5">
          <Row label="Name" value={user?.name || "-"} />
          <Row label="Email" value={user?.email || "-"} />
          <Row label="Nomor Handphone" value={user?.phone || "-"} />
        </div>

        <button
          className="mt-8 w-full bg-red-alt text-white py-3 rounded-full font-extrabold hover:opacity-95 transition cursor-pointer"
          onClick={() => navigate("/profile/edit")}
          type="button"
        >
          Update Profile
        </button>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <p className="text-sm text-black-alt">{label}</p>
      <p className="text-sm font-extrabold text-black-alt text-right">
        {value}
      </p>
    </div>
  );
}
