export type Block =
  | { t: "p"; text: string }
  | { t: "h2"; text: string }
  | { t: "list"; items: string[]; ordered?: boolean }
  | { t: "callout"; text: string };

export interface PostCta {
  title: string;
  body: string;
  href: string;
  label: string;
}

export interface Post {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  keywords: string[];
  published: string;
  updated?: string;
  readMinutes: number;
  intro: string;
  cta: PostCta;
  related: string[];
  blocks: Block[];
}