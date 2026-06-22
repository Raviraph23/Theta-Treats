"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const REDIRECT_DELAY_MS = 5000;

export function OrderConfirmationRedirect() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(
    Math.ceil(REDIRECT_DELAY_MS / 1000),
  );

  useEffect(() => {
    const countdown = setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    const redirect = setTimeout(() => {
      router.push("/");
    }, REDIRECT_DELAY_MS);

    return () => {
      clearInterval(countdown);
      clearTimeout(redirect);
    };
  }, [router]);

  return (
    <p className="mt-4 text-center text-sm text-foreground/60">
      Returning to menu in {secondsLeft}s…
    </p>
  );
}
