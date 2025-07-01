"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface FallbackImageProps extends ImageProps {
  fallbackSrc?: string;
}

export default function FallbackImage({
  src,
  fallbackSrc = "/default-fallback-image.png",
  alt,
  ...props
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
