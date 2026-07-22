import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export type MarkdownBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt: string; width?: number; height?: number };

export type WorkDetail = {
  slug: string;
  title: string;
  category: string;
  period: string;
  team: string;
  cover: string;
  modalImage: string;
  stacks: string[];
  cardDate: string;
  cardExcerpt: string;
  cardTags: string[];
  cardImage: string;
  thumbnail: string;
  order: number;
  blocks: MarkdownBlock[];
};

const detailsDirectory = path.join(process.cwd(), "content", "work-details");

function parseFrontmatter(source: string) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    return { meta: new Map<string, string>(), body: source };
  }

  const meta = new Map<string, string>();

  for (const line of match[1].split("\n")) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) continue;

    meta.set(line.slice(0, separatorIndex).trim(), line.slice(separatorIndex + 1).trim());
  }

  return { meta, body: match[2] };
}

function parseImageDimension(value: string | undefined) {
  if (!value) return undefined;

  const numericValue = Number(value.replace(/^["']|["']$/g, ""));
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : undefined;
}

function parseMarkdownBlocks(markdown: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  };

  const flushList = () => {
    if (!list.length) return;
    blocks.push({ type: "list", items: list });
    list = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", text: trimmed.replace(/^##\s+/, "") });
      continue;
    }

    const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)(?:\{([^}]+)\})?$/);
    if (imageMatch) {
      flushParagraph();
      flushList();

      const attrs = new Map(
        (imageMatch[3] || "")
          .split(/\s+/)
          .map((attr) => attr.split("="))
          .filter(([key, value]) => key && value) as Array<[string, string]>,
      );

      blocks.push({
        type: "image",
        alt: imageMatch[1],
        src: imageMatch[2],
        width: parseImageDimension(attrs.get("width")),
        height: parseImageDimension(attrs.get("height")),
      });
      continue;
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph();
      list.push(trimmed.slice(2));
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return blocks;
}

function readMeta(meta: Map<string, string>, key: string, fallback = "") {
  return meta.get(key) || fallback;
}

export async function getWorkDetails(): Promise<WorkDetail[]> {
  const files = (await readdir(detailsDirectory)).filter((file) => file.endsWith(".md"));

  const details = await Promise.all(
    files.map(async (file) => {
      const source = await readFile(path.join(detailsDirectory, file), "utf8");
      const { meta, body } = parseFrontmatter(source);
      const slug = readMeta(meta, "slug", file.replace(/\.md$/, ""));

      return {
        slug,
        title: readMeta(meta, "title", slug),
        category: readMeta(meta, "category", "Project"),
        period: readMeta(meta, "period", "LIVE"),
        team: readMeta(meta, "team", "1名体制"),
        cover: readMeta(meta, "cover", "/assets/hero/gp-ciber-machine-stream.webp"),
        modalImage: readMeta(
          meta,
          "modalImage",
          readMeta(meta, "cover", "/assets/hero/gp-ciber-machine-dogfight-mini.png"),
        ),
        stacks: readMeta(meta, "stacks")
          .split(",")
          .map((stack) => stack.trim())
          .filter(Boolean),
        cardDate: readMeta(meta, "cardDate", readMeta(meta, "period", "LIVE")),
        cardExcerpt: readMeta(meta, "cardExcerpt"),
        cardTags: readMeta(meta, "cardTags", readMeta(meta, "stacks"))
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        cardImage: readMeta(meta, "cardImage", readMeta(meta, "cover", "/assets/hero-car.webp")),
        thumbnail: readMeta(
          meta,
          "thumbnail",
          readMeta(meta, "cardImage", readMeta(meta, "cover", "/assets/hero-car.webp")),
        ),
        order: Number(readMeta(meta, "order", "999")),
        blocks: parseMarkdownBlocks(body),
      } satisfies WorkDetail;
    }),
  );

  return details.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}
