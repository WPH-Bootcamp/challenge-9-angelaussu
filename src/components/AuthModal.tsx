import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AuthTabs } from "./AuthTabs";

export function AuthModal({ open, onOpenChange }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-0 overflow-hidden">
        <div className="grid grid-cols-2">
          <div className="bg-primary text-white p-8">
            <h2 className="text-3xl font-bold mb-2">Welcome!</h2>
            <p className="text-sm opacity-90">
              Login atau daftar untuk lanjut.
            </p>
          </div>

          <div className="p-8">
            <AuthTabs onSuccess={() => onOpenChange(false)} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
