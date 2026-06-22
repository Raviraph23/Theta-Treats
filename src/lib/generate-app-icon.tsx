import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { COLORS } from "@/lib/constants";

async function getLogoDataUrl() {
  const logoPath = join(process.cwd(), "src/assets/theta-logo.png");
  const logoBuffer = await readFile(logoPath);

  return `data:image/png;base64,${logoBuffer.toString("base64")}`;
}

export async function generateAppIcon(size: number) {
  const logoSrc = await getLogoDataUrl();
  const padding = Math.round(size * 0.06);
  const ring = Math.max(1, Math.round(size * 0.06));
  const inner = size - padding * 2;

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: COLORS.offWhite,
        }}
      >
        <div
          style={{
            width: inner,
            height: inner,
            borderRadius: "50%",
            overflow: "hidden",
            display: "flex",
            border: `${ring}px solid rgba(181, 136, 54, 0.3)`,
          }}
        >
          <img
            src={logoSrc}
            alt=""
            width={inner}
            height={inner}
            style={{
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    ),
    {
      width: size,
      height: size,
    },
  );
}
