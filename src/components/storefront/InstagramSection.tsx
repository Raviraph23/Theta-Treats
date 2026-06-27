import Image from "next/image";
import { INSTAGRAM_GALLERY } from "@/lib/content/instagram";
import { SITE } from "@/lib/constants";

export function InstagramSection() {
  return (
    <section
      id="instagram"
      className="border-t border-accent/15 bg-primary/40 px-4 py-12"
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Follow Us
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground">
            @theta_treats on Instagram
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-foreground/70">
            A peek at our latest bakes — follow for new drops, behind-the-scenes,
            and special offers.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          {INSTAGRAM_GALLERY.map((post) => (
            <a
              key={post.src}
              href="https://www.instagram.com/theta_treats/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl bg-off-white ring-1 ring-accent/10 transition hover:ring-accent/30"
            >
              <Image
                src={post.src}
                alt={post.alt}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/20 group-hover:opacity-100">
                <InstagramIcon className="h-8 w-8 text-white drop-shadow" />
              </span>
            </a>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          <div className="rounded-2xl bg-off-white p-3 shadow-lg ring-2 ring-accent/20">
            <Image
              src={SITE.instagramQr}
              alt="Scan to follow Theta Treats on Instagram"
              width={140}
              height={140}
              className="h-32 w-32 object-contain sm:h-36 sm:w-36"
            />
          </div>

          <div className="flex flex-col items-center gap-3 sm:items-start">
            <p className="text-sm text-foreground/70">
              Scan the QR code or tap below to follow
            </p>
            <a
              href="https://www.instagram.com/theta_treats/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#bc1888] px-6 text-sm font-semibold text-white shadow-md transition active:scale-[0.98]"
            >
              <InstagramIcon className="h-5 w-5" />
              Follow on Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
