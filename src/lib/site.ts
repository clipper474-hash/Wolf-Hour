/** Single source of truth for the public origin. On domain migration, set
 *  NEXT_PUBLIC_SITE_URL in the Vercel env — nothing else to change. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wolfhour.vercel.app";
