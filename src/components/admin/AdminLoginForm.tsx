"use client";

import { useActionState } from "react";
import { signIn } from "@/app/actions/admin";

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </div>

      {state?.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex h-11 w-full items-center justify-center rounded-full bg-accent text-sm font-semibold text-off-white disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
