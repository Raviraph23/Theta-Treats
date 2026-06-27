import type { ImageProps } from "next/image";
import {
  resolveProductImageSrc,
  shouldUseUnoptimizedImage,
} from "@/lib/products/image-src";

type ProductImageSrcProps = Pick<ImageProps, "src" | "unoptimized">;

export function productImageProps(src: string): ProductImageSrcProps {
  const resolvedSrc = resolveProductImageSrc(src);
  return {
    src: resolvedSrc,
    unoptimized: shouldUseUnoptimizedImage(resolvedSrc),
  };
}
