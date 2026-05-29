export type NewsPost = {
  slug: string;
  title: string;
  date: string;
  publishedAt?: string;
  displayDate: string;
  excerpt: string;
  tags: string[];
  source: string;
  link: string;
  image?: string;
  body: string;
  featured?: boolean;
};
