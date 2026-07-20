export type PortfolioPost = {
  id: number;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  image?: string;
};

const fallbackPosts: PortfolioPost[] = [
  {
    id: 1,
    slug: "dual-platform-renewal",
    title: "双系プラットフォームリニューアル",
    date: "2026.03",
    excerpt:
      "UI/UX、Laravel、Next.js を横断して運用基盤を再設計。高負荷な記事更新とキャンペーン配信に耐える情報設計へ刷新。",
    tags: ["要件定義", "UI設計", "Next.js", "Laravel", "Vercel"],
    image: "/assets/hero-racer.webp",
  },
  {
    id: 2,
    slug: "realtime-article-delivery",
    title: "リアルタイム記事配信基盤",
    date: "2025.11",
    excerpt:
      "WordPress REST API と ISR を組み合わせ、編集者の更新体験と表示速度を両立するコンテンツフローを構築。",
    tags: ["WordPress", "REST API", "ISR", "CMS", "SEO"],
    image: "/assets/hero-car.webp",
  },
];

type WordPressPost = {
  id: number;
  slug?: string;
  date?: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url?: string }>;
    "wp:term"?: Array<Array<{ name?: string }>>;
  };
};

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export async function getPortfolioPosts(): Promise<PortfolioPost[]> {
  const baseUrl = process.env.WORDPRESS_API_BASE_URL;

  if (!baseUrl) {
    return fallbackPosts;
  }

  try {
    const response = await fetch(
      `${baseUrl.replace(/\/$/, "")}/wp-json/wp/v2/posts?_embed&per_page=6`,
      {
        next: {
          revalidate: 300,
          tags: ["wordpress-posts"],
        },
      },
    );

    if (!response.ok) {
      return fallbackPosts;
    }

    const posts = (await response.json()) as WordPressPost[];

    return posts.map((post) => ({
      id: post.id,
      slug: post.slug || String(post.id),
      title: stripHtml(post.title?.rendered) || "UNTITLED_TRANSMISSION",
      date: post.date ? post.date.slice(0, 10).replaceAll("-", ".") : "LIVE",
      excerpt: stripHtml(post.excerpt?.rendered),
      tags:
        post._embedded?.["wp:term"]?.flat().map((term) => term.name || "").filter(Boolean) ??
        [],
      image: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
    }));
  } catch {
    return fallbackPosts;
  }
}
