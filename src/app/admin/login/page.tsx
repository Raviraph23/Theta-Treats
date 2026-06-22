import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { SITE } from "@/lib/constants";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-off-white px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl font-bold text-foreground">
          {SITE.name} Admin
        </h1>
        <p className="mt-2 text-sm text-foreground/70">
          Sign in to manage orders.
        </p>
        <div className="mt-8">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
