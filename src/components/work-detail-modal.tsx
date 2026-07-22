"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import type { MarkdownBlock, WorkDetail } from "@/lib/work-details";

const modalBackground = "/assets/hero/gp-ciber-machine-dogfight-mini.png";
const desktopPageSize = 2;
const mobilePageSize = 3;

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

        if (block.type === "image") {
          const width = block.width && Number.isFinite(block.width) ? block.width : 320;
          const height = block.height && Number.isFinite(block.height) ? block.height : 180;

          return (
            <figure
              className="work-modal__inline-image"
              key={`${block.type}-${index}`}
              style={{ width, maxWidth: "100%" }}
            >
              <span className="work-modal__inline-image-frame" style={{ height }}>
                <Image
                  src={block.src}
                  alt={block.alt}
                  fill
                  sizes={`(max-width: 760px) 82vw, ${width}px`}
                  unoptimized={!block.src.startsWith("/")}
                />
              </span>
              {block.alt ? <figcaption>{block.alt}</figcaption> : null}
            </figure>
          );
        }

        return <p key={`${block.type}-${index}`}>{block.text}</p>;
      })}
    </>
  );
}

export function WorkDetailModal({ works }: WorkDetailModalProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [desktopPage, setDesktopPage] = useState(0);
  const [mobilePage, setMobilePage] = useState(0);
  const desktopViewportRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScrollRef = useRef(false);
  const scrollEndTimerRef = useRef<number | null>(null);
  const shouldScrollToWorksRef = useRef(false);
  const activeDetail = useMemo(
    () => works.find((detail) => detail.slug === activeSlug) ?? null,
    [activeSlug, works],
  );
  const desktopPageCount = Math.max(1, Math.ceil(works.length / desktopPageSize));
  const pageCount = Math.max(1, Math.ceil(works.length / mobilePageSize));
  const mobileWorks = works.slice(
    mobilePage * mobilePageSize,
    mobilePage * mobilePageSize + mobilePageSize,
  );

  const scrollDesktopPage = (nextPage: number) => {
    const viewport = desktopViewportRef.current;
    if (!viewport) return;

    const rail = viewport.querySelector<HTMLElement>(".works__rail");
    const cards = Array.from(viewport.querySelectorAll<HTMLElement>(".work-card"));
    if (!rail || !cards.length) return;

    const page = Math.min(Math.max(nextPage, 0), desktopPageCount - 1);
    const index = Math.min(page * desktopPageSize, cards.length - 1);
    const viewportInset = (viewport.clientWidth - (cards[0].offsetWidth * desktopPageSize + Number.parseFloat(getComputedStyle(rail).columnGap || "0"))) / 2;
    const left = Math.max(0, cards[index].offsetLeft - Math.max(0, viewportInset));

    setDesktopPage(page);
    isProgrammaticScrollRef.current = true;
    if (scrollEndTimerRef.current) {
      window.clearTimeout(scrollEndTimerRef.current);
    }
    viewport.scrollTo({ left, behavior: "smooth" });
  };

  const syncDesktopPage = () => {
    const viewport = desktopViewportRef.current;
    if (!viewport) return;

    if (isProgrammaticScrollRef.current) {
      if (scrollEndTimerRef.current) {
        window.clearTimeout(scrollEndTimerRef.current);
      }
      scrollEndTimerRef.current = window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 180);
      return;
    }

    const rail = viewport.querySelector<HTMLElement>(".works__rail");
    const card = viewport.querySelector<HTMLElement>(".work-card");
    if (!rail || !card) return;

    const gap = Number.parseFloat(getComputedStyle(rail).columnGap || "0");
    const pageWidth = desktopPageSize * (card.offsetWidth + gap);
    if (!pageWidth) return;

    setDesktopPage(Math.min(desktopPageCount - 1, Math.max(0, Math.round(viewport.scrollLeft / pageWidth))));
  };

  const setMobilePageAndScroll = (nextPage: number) => {
    shouldScrollToWorksRef.current = true;
    setMobilePage(Math.min(pageCount - 1, Math.max(0, nextPage)));
  };

  useEffect(() => {
    if (!shouldScrollToWorksRef.current) return;

    shouldScrollToWorksRef.current = false;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById("works")?.scrollIntoView({ block: "start", behavior: "auto" });
      });
    });
  }, [mobilePage]);

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
          src={activeDetail.modalImage || modalBackground}
          alt=""
          fill
          sizes="min(94vw, 1600px)"
          unoptimized={Boolean(activeDetail.modalImage && !activeDetail.modalImage.startsWith("/"))}
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
      <div
        className="works__viewport works__viewport--desktop"
        ref={desktopViewportRef}
        onScroll={syncDesktopPage}
      >
        <div className="works__rail" aria-label="Works list">
          {works.map((work) => (
            <WorkCard key={work.slug} work={work} onOpen={() => setActiveSlug(work.slug)} />
          ))}
        </div>
      </div>
      {desktopPageCount > 1 ? (
        <div className="works__pager works__pager--desktop" aria-label="Works pagination">
          <button
            type="button"
            aria-label="前のWORKSを表示"
            disabled={desktopPage === 0}
            onClick={() => scrollDesktopPage(desktopPage - 1)}
          >
            <ArrowLeft size={16} />
          </button>
          <span>
            {desktopPage + 1} / {desktopPageCount}
          </span>
          <button
            type="button"
            aria-label="次のWORKSを表示"
            disabled={desktopPage >= desktopPageCount - 1}
            onClick={() => scrollDesktopPage(desktopPage + 1)}
          >
            <ArrowRight size={16} />
          </button>
        </div>
      ) : null}

      <div className="works__viewport works__viewport--mobile">
        <div className="works__rail" aria-label="Works list">
          {mobileWorks.map((work) => (
            <WorkCard key={work.slug} work={work} onOpen={() => setActiveSlug(work.slug)} />
          ))}
        </div>
        {pageCount > 1 ? (
          <div className="works__pager works__pager--mobile" aria-label="Works pagination">
            <button
              type="button"
              aria-label="前のWORKSを表示"
              disabled={mobilePage === 0}
              onClick={() => setMobilePageAndScroll(mobilePage - 1)}
            >
              <ArrowLeft size={16} />
            </button>
            <span>
              {mobilePage + 1} / {pageCount}
            </span>
            <button
              type="button"
              aria-label="次のWORKSを表示"
              disabled={mobilePage >= pageCount - 1}
              onClick={() => setMobilePageAndScroll(mobilePage + 1)}
            >
              <ArrowRight size={16} />
            </button>
          </div>
        ) : null}
      </div>

      {modal ? createPortal(modal, document.body) : null}
    </>
  );
}

function WorkCard({ work, onOpen }: { work: WorkDetail; onOpen: () => void }) {
  const thumbnail = work.thumbnail || work.cardImage;

  return (
    <article className="work-card">
      <div className="work-card__image">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt=""
            fill
            sizes="(max-width: 760px) 86vw, 460px"
            unoptimized={!thumbnail.startsWith("/")}
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
        <button type="button" aria-label={`${work.title} の詳細`} aria-haspopup="dialog" onClick={onOpen}>
          <ArrowUpRight size={16} />
          詳細
        </button>
      </div>
    </article>
  );
}
