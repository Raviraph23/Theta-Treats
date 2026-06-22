"use client";

import Image, { type ImageProps } from "next/image";
import {
  resolveProductImageSrc,
  shouldUseUnoptimizedImage,
} from "@/lib/products/image-src";

type ProductImageProps = Omit<ImageProps, "src" | "unoptimized"> & {
  src: string;
};

export function ProductImage({ src, ...props }: ProductImageProps) {
  const resolvedSrc = resolveProductImageSrc(src);

  return (
    <Image
      src={resolvedSrc}
      unoptimized={shouldUseUnoptimizedImage(resolvedSrc)}
      {...props}
    />
  );
}
