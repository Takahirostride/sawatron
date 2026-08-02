"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { PortfolioContent } from "@/lib/portfolio";

type AboutService = PortfolioContent["about"]["services"][number];

type AboutCardStackProps = {
  services: AboutService[];
};

function textLines(value: string | string[]) {
  const normalizeLineBreaks = (line: string) => line.replace(/\/n/g, "\n").replace(/\\n/g, "\n");
  return Array.isArray(value)
    ? value.map((line) => normalizeLineBreaks(line)).join("\n")
    : normalizeLineBreaks(value);
}

function getCardState(index: number, activeIndex: number, total: number) {
  const offset = (index - activeIndex + total) % total;

  if (offset === 0) return "active";
  if (offset === 1) return "next";
  if (offset === 2) return "after";
  return "hidden";
}

export function AboutCardStack({ services }: AboutCardStackProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = services.length;

  if (!total) return null;

  const goToPrevious = () => setActiveIndex((current) => (current - 1 + total) % total);
  const goToNext = () => setActiveIndex((current) => (current + 1) % total);

  return (
    <div className="about-stack">
      <div className="about-stack__viewport" aria-live="polite">
        {services.map((service, index) => {
          const state = getCardState(index, activeIndex, total);

          return (
            <article
              className="about-stack__card"
              data-state={state}
              aria-hidden={state !== "active"}
              key={service.title}
            >
              <div className="about-stack__card-head">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h2>{service.title}</h2>
                <b>{service.parameter}</b>
              </div>
              <p>{textLines(service.body)}</p>
            </article>
          );
        })}
      </div>

      <div className="about-stack__controls">
        <button type="button" aria-label="前のスキルカードを表示" onClick={goToPrevious}>
          <ChevronLeft size={18} />
        </button>
        <div aria-label={`${activeIndex + 1} / ${total}`}>
          {services.map((service, index) => (
            <button
              type="button"
              aria-label={`${service.title} を表示`}
              aria-current={index === activeIndex ? "true" : undefined}
              key={service.title}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
        <button type="button" aria-label="次のスキルカードを表示" onClick={goToNext}>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
