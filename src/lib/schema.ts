import { SITE_URL } from "@/lib/site";

const ORG = {
  "@type": "Organization",
  name: "Wolfhour",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/brand/icon-512-maskable.png`,
};

/** Article JSON-LD for the content pages — seeds author/date signals the
 *  pages otherwise lack. Author is the Wolfhour org until a personal byline exists. */
export function articleLd(o: {
  headline: string;
  description: string;
  path: string;
  image: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: o.headline,
    description: o.description,
    image: `${SITE_URL}${o.image}`,
    author: ORG,
    publisher: ORG,
    datePublished: o.datePublished,
    dateModified: o.dateModified,
    mainEntityOfPage: `${SITE_URL}${o.path}`,
  };
}
