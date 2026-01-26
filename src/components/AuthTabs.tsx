import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Logo from "../assets/logo-black.svg";
import ShowPw from "../assets/eye.svg";
import HidePw from "../assets/hide.png";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "react-router-dom";

type TabType = "login" | "register";

type FormState = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export function AuthTabs({ onSuccess }: { onSuccess?: () => void }) {
  const { login, register } = useAuth();

  const location = useLocation();
  const defaultTab = (location.state?.tab || "login") as TabType;
  const [tab, setTab] = useState<TabType>(defaultTab);

  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] =
    useState(false);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState<
    Partial<Record<keyof FormState, boolean>>
  >({});
  const [errors, setErrors] = useState<FormErrors>({});

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = (activeTab: TabType, data: FormState): FormErrors => {
    const e: FormErrors = {};

    if (activeTab === "login") {
      if (!data.email) e.email = "Email wajib diisi";
      else if (!validateEmail(data.email)) e.email = "Email tidak valid";

      if (!data.password) e.password = "Password wajib diisi";
    } else {
      if (!data.name) e.name = "Nama lengkap wajib diisi";

      if (!data.email) e.email = "Email wajib diisi";
      else if (!validateEmail(data.email)) e.email = "Email tidak valid";

      if (!data.phone) e.phone = "Nomor telepon wajib diisi";

      if (!data.password) e.password = "Password wajib diisi";
      else if (data.password.length < 6)
        e.password = "Password minimal 6 karakter";

      if (!data.confirmPassword)
        e.confirmPassword = "Confirm password wajib diisi";
      else if (data.password !== data.confirmPassword)
        e.confirmPassword = "Password dan Confirm Password tidak sama";
    }

    return e;
  };

  const recomputeErrors = (nextForm: FormState, nextTouched = touched) => {
    const all = validate(tab, nextForm);
    const filtered: FormErrors = {};
    (Object.keys(all) as (keyof FormState)[]).forEach((k) => {
      if (nextTouched[k]) filtered[k] = all[k];
    });
    setErrors(filtered);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name as keyof FormState;
    const next = { ...form, [key]: value } as FormState;
    setForm(next);

    if (touched[key]) recomputeErrors(next);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const key = e.target.name as keyof FormState;
    const nextTouched = { ...touched, [key]: true };
    setTouched(nextTouched);
    recomputeErrors(form, nextTouched);
  };

  const errorClass = (field: keyof FormState) =>
    errors[field] ? "border-red-500 focus:border-red-500" : "border-neutral";

  const ErrorText = ({ field }: { field: keyof FormState }) =>
    errors[field] ? (
      <p className="mt-1 text-sm text-red-500">{errors[field]}</p>
    ) : null;

  const submit = async () => {
    try {
      setLoading(true);

      const mustTouch: (keyof FormState)[] =
        tab === "login"
          ? ["email", "password"]
          : ["name", "email", "phone", "password", "confirmPassword"];

      const nextTouched = { ...touched };
      mustTouch.forEach((k) => (nextTouched[k] = true));
      setTouched(nextTouched);

      const allErrors = validate(tab, form);
      if (Object.keys(allErrors).length > 0) {
        const filtered: FormErrors = {};
        (Object.keys(allErrors) as (keyof FormState)[]).forEach((k) => {
          if (nextTouched[k]) filtered[k] = allErrors[k];
        });
        setErrors(filtered);
        return;
      }

      if (tab === "login") {
        await login(form.email, form.password, rememberMe);
      } else {
        await register(
          form.name,
          form.email,
          form.phone,
          form.password,
          rememberMe,
        );
      }

      onSuccess?.();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      {/* HEADER */}
      <div className="mb-5">
        <img src={Logo} alt="Logo" className="mb-5 h-10.5 w-auto" />
        <h1 className="text-[28px] font-extrabold text-black-alt">
          {tab === "login" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="mt-1 text-base text-black-alt">
          {tab === "login"
            ? "Good to see you again! Let’s eat"
            : "Fill your details to create account"}
        </p>
      </div>

      {/* TABS */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as TabType)}>
        <TabsList className="mb-6 w-full bg-neutral p-2 h-13.5!">
          <TabsTrigger
            value="login"
            className="w-43.75 h-10 cursor-pointer py-1.25 text-black-alt text-base font-bold data-[state=active]:bg-white transition-all duration-200"
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value="register"
            className="w-43.75 h-10 cursor-pointer py-1.25 text-black-alt text-base font-bold data-[state=active]:bg-white transition-all duration-200"
          >
            Register
          </TabsTrigger>
        </TabsList>

        {/* prevent native validation popup */}
        <form noValidate onSubmit={(e) => e.preventDefault()}>
          {/* LOGIN */}
          <TabsContent value="login" className="space-y-4">
            <div>
              <Input
                name="email"
                placeholder="Email"
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${errorClass(
                  "email",
                )} text-base py-3.25 px-3 h-14 rounded-3 focus:ring-0 focus-visible:ring-0 focus:outline-none`}
              />
              <ErrorText field="email" />
            </div>

            <div>
              <div className="relative">
                <Input
                  name="password"
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`pr-12 ${errorClass(
                    "password",
                  )} text-base h-14 rounded-3 focus:ring-0 focus-visible:ring-0`}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <img
                    src={showLoginPassword ? HidePw : ShowPw}
                    alt={showLoginPassword ? "Hide password" : "Show password"}
                    className="h-4 w-4 cursor-pointer"
                  />
                </button>
              </div>
              <ErrorText field="password" />
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="remember-login"
                checked={rememberMe}
                onCheckedChange={(v) => setRememberMe(!!v)}
              />
              <label htmlFor="remember-login">Remember me</label>
            </div>
          </TabsContent>

          {/* REGISTER */}
          <TabsContent value="register" className="space-y-4">
            <div>
              <Input
                name="name"
                placeholder="Nama Lengkap"
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${errorClass(
                  "name",
                )} text-base py-3.25 px-3 h-14 rounded-3 focus:ring-0 focus-visible:ring-0 focus:outline-none`}
              />
              <ErrorText field="name" />
            </div>

            <div>
              <Input
                name="email"
                placeholder="Email"
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${errorClass(
                  "email",
                )} text-base py-3.25 px-3 h-14 rounded-3 focus:ring-0 focus-visible:ring-0 focus:outline-none`}
              />
              <ErrorText field="email" />
            </div>

            <div>
              <Input
                name="phone"
                placeholder="Nomor Telepon"
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${errorClass(
                  "phone",
                )} text-base py-3.25 px-3 h-14 rounded-3 focus:ring-0 focus-visible:ring-0 focus:outline-none`}
              />
              <ErrorText field="phone" />
            </div>

            <div>
              <div className="relative">
                <Input
                  name="password"
                  type={showRegisterPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`pr-12 ${errorClass(
                    "password",
                  )} text-base h-14 rounded-3 focus:ring-0 focus-visible:ring-0`}
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <img
                    src={showRegisterPassword ? HidePw : ShowPw}
                    alt={
                      showRegisterPassword ? "Hide password" : "Show password"
                    }
                    className="h-4 w-4 cursor-pointer"
                  />
                </button>
              </div>
              <ErrorText field="password" />
            </div>

            <div>
              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showRegisterConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`pr-12 ${errorClass(
                    "confirmPassword",
                  )} text-base h-14 rounded-3 focus:ring-0 focus-visible:ring-0`}
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterConfirmPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <img
                    src={showRegisterConfirmPassword ? HidePw : ShowPw}
                    alt={
                      showRegisterConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="h-4 w-4 cursor-pointer"
                  />
                </button>
              </div>
              <ErrorText field="confirmPassword" />
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="remember-register"
                checked={rememberMe}
                onCheckedChange={(v) => setRememberMe(!!v)}
              />
              <label htmlFor="remember-register">Remember me</label>
            </div>
          </TabsContent>

          <Button
            type="button"
            className="mt-6 w-full bg-red-alt border-red-alt text-white font-bold font-base"
            disabled={loading}
            onClick={submit}
          >
            {loading ? "Loading..." : tab === "login" ? "Login" : "Sign Up"}
          </Button>
        </form>
      </Tabs>
    </div>
  );
}
