import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImage } from "@/types";

// @sanity/image-url does not export SanityImageSource publicly in all versions;
// use a compatible inline type instead.
type SanityImageSource =
  | string
  | { _ref: string }
  | { asset: { _ref: string } }
  | SanityImage;

const builder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
});

export function imageUrlFor(source: SanityImageSource | SanityImage) {
  return builder.image(source);
}

/**
 * Returns a { src, blurDataURL } pair suitable for next/image.
 * The blur placeholder is a tiny 20px-wide version of the image.
 */
export function sanityImageProps(
  image: SanityImage,
  width: number,
  height: number
) {
  const base = imageUrlFor(image).width(width).height(height).fit("crop");
  return {
    src: base.url(),
    blurDataURL: imageUrlFor(image).width(20).height(Math.round((20 * height) / width)).blur(10).url(),
    placeholder: "blur" as const,
    width,
    height,
  };
}
