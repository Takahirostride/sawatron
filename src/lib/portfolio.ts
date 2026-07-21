import { readFile } from "node:fs/promises";
import path from "node:path";

type TextLines = string | string[];

export type PortfolioContent = {
  about: {
    sectionCode: string;
    heading: {
      text: string;
      accent: string;
    };
    services: Array<{
      title: string;
      parameter: string;
      body: TextLines;
    }>;
    metrics: Array<{
      label: string;
      value: number;
    }>;
  };
  skills: {
    heading: {
      text: string;
      accent: string;
    };
    description: TextLines;
    bankLabel: string;
    tags: string[];
  };
  experience: {
    log: {
      sectionCode: string;
      items: Array<{
        year: string;
        title: string;
        company: string;
        body: TextLines;
      }>;
    };
    profile: {
      sectionCode: string;
      name: string;
      body: TextLines;
    };
  };
};

const portfolioPath = path.join(process.cwd(), "content", "portfolio.json");

export function textLines(value: TextLines) {
  return Array.isArray(value) ? value.join("\n") : value;
}

export async function getPortfolioContent(): Promise<PortfolioContent> {
  const source = await readFile(portfolioPath, "utf8");
  return JSON.parse(source) as PortfolioContent;
}
