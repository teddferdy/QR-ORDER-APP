// Cloudinary serves the originally-uploaded asset regardless of how small
// it's actually displayed (e.g. a real product photo measured at 710x1080
// natural size, rendered into a ~360px-wide card — see the Phase 4B
// performance audit). This applies Cloudinary's own on-the-fly resizing via
// its URL transformation segment so the browser downloads an
// appropriately-sized asset instead of the original. Width-only sizing is
// used (no crop) so the existing `object-cover` CSS at each call site keeps
// producing the exact same visual crop it already does today, just from a
// smaller source image. Any URL that isn't Cloudinary-hosted (the
// hardcoded stock-photo fallback, a future provider) is returned
// unchanged, and a URL that already carries a Cloudinary transformation
// segment is also returned unchanged rather than double-transformed.

// Small surface: MenuCard's grid image, ProductQuickPreview's gallery
// image and thumbnail strip, ProductDetailPage's thumbnail strip — all
// render at roughly 300-512 CSS px wide across the supported viewports.
export const PRODUCT_IMAGE_WIDTH_SMALL = 640;

// Large surface: ProductDetailPage's hero/carousel image — the widest
// container in the app (up to the page's ~672px max-w-2xl on desktop).
export const PRODUCT_IMAGE_WIDTH_LARGE = 1080;

export function transformCloudinaryImage(
  url: string | null | undefined,
  width: number,
): string {
  if (!url) return url ?? "";

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  if (parsed.hostname !== "res.cloudinary.com") return url;

  const marker = "/image/upload/";
  const markerIndex = parsed.pathname.indexOf(marker);
  if (markerIndex === -1) return url;

  const before = parsed.pathname.slice(0, markerIndex + marker.length);
  const after = parsed.pathname.slice(markerIndex + marker.length);
  const firstSegment = after.split("/")[0] ?? "";
  // A transformation segment looks like "f_auto,q_auto,w_640"; a version
  // segment ("v1787934602") or a bare public-id never starts this way, so
  // this is a safe, standard way to detect "already transformed" and avoid
  // stacking a second transformation segment onto the same URL.
  const alreadyTransformed = /^[a-z]{1,3}_/.test(firstSegment);
  if (alreadyTransformed) return url;

  // c_limit resizes down to at most the given width but never scales a
  // smaller original up past its own size — confirmed necessary live: at
  // least one real product photo in this system is only 710px wide
  // natively, and without c_limit a w_1080 request was upscaling it to
  // 1080 (naturalHeight growing from 1080 to 1643), which is pure wasted
  // bytes with no real quality gain.
  parsed.pathname = `${before}f_auto,q_auto,c_limit,w_${width}/${after}`;
  return parsed.toString();
}
