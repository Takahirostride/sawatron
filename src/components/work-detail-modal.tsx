"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, X } from "lucide-react";
import type { MarkdownBlock, WorkDetail } from "@/lib/work-details";

const modalBackground = "/assets/hero/gp-ciber-machine-dogfight-mini.png";

type WorkDetailModalProps = {
  works: WorkDetail[];
};

function DetailBlocks({ blocks }: { blocks: MarkdownBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return <h3 key={`${block.type}-${index}`}>{block.text}</h3>;
        }

        if (block.type === "list") {
          return (
            <ul key={`${block.type}-${index}`}>
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>{item}</li>
              ))}
            </ul>
          );
        }

        return <p key={`${block.type}-${index}`}>{block.text}</p>;
      })}
    </>
  );
}

export function WorkDetailModal({ works }: WorkDetailModalProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const activeDetail = useMemo(
    () => works.find((detail) => detail.slug === activeSlug) ?? null,
    [activeSlug, works],
  );

  useEffect(() => {
    if (!activeDetail) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveSlug(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeDetail]);

  const modal = activeDetail ? (
    <div
      className="work-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="work-modal-title"
    >
      <button
        className="work-modal__backdrop"
        type="button"
        aria-label="詳細を閉じる"
        onClick={() => setActiveSlug(null)}
      />
      <article className="work-modal__panel">
        <Image
          className="work-modal__cover"
          src={modalBackground}
          alt=""
          fill
          sizes="min(94vw, 1600px)"
        />
        <div className="work-modal__wash" />
        <button
          className="work-modal__close"
          type="button"
          onClick={() => setActiveSlug(null)}
          aria-label="詳細を閉じる"
        >
          <X size={28} />
        </button>

        <div className="work-modal__content">
          <header className="work-modal__header">
            <h2 id="work-modal-title">{activeDetail.title}</h2>
            <div className="work-modal__meta">
              <span>{activeDetail.period}</span>
              <span>{activeDetail.category}</span>
              <span>{activeDetail.team}</span>
            </div>
          </header>

          <div className="work-modal__grid">
            <section className="work-modal__body" aria-label="Project details">
              <DetailBlocks blocks={activeDetail.blocks} />
            </section>

            <aside className="work-modal__stack" aria-label="Tech stack">
              <h3>TECH STACK</h3>
              <div>
                {activeDetail.stacks.map((stack) => (
                  <span key={stack}>{stack}</span>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </article>
    </div>
  ) : null;

  return (
    <>
      <div className="works__rail">
        {works.slice(0, 2).map((work) => {
          return (
            <article className="work-card" key={work.slug}>
              <div className="work-card__image">
                {work.cardImage ? (
                  <Image
                    src={work.cardImage}
                    alt=""
                    fill
                    sizes="(max-width: 760px) 86vw, 460px"
                    unoptimized={!work.cardImage.startsWith("/")}
                  />
                ) : null}
              </div>
              <div className="work-card__content">
                <h2>{work.title}</h2>
                <time>{work.cardDate}</time>
                <p>{work.cardExcerpt}</p>
                <div className="work-card__tags">
                  {work.cardTags.slice(0, 6).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <button
                  type="button"
                  aria-label={`${work.title} の詳細`}
                  aria-haspopup="dialog"
                  onClick={() => setActiveSlug(work.slug)}
                >
                  <ArrowUpRight size={16} />
                  詳細
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {modal ? createPortal(modal, document.body) : null}
    </>
  );
}
