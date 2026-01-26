import { AuthLayout } from "@/components/AuthLayout";
import { AuthTabs } from "@/components/AuthTabs";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <AuthTabs onSuccess={() => navigate("/")} />
    </AuthLayout>
  );
}
