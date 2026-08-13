"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const slideCount = 24;
const shortSlideNumbers = new Set([9, 15, 17, 18, 22]);

const slides = Array.from({ length: slideCount }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");

  return {
    alt: `講師実績スライド ${index + 1}`,
    full: `/assets/instruction/gp-exp-instructor-${number}.png`,
    height: shortSlideNumbers.has(index + 1) ? 337 : 338,
    thumbnail: `/assets/thumbnails/th-exp-instructor-${number}.png`,
  };
});

export function CharacterGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeSlide = activeIndex === null ? null : slides[activeIndex];

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      } else if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null ? null : (current - 1 + slideCount) % slideCount,
        );
      } else if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? null : (current + 1) % slideCount,
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex]);

  const close = () => {
    const previousIndex = activeIndex;
    setActiveIndex(null);
    window.requestAnimationFrame(() => {
      if (previousIndex !== null) triggerRefs.current[previousIndex]?.focus();
    });
  };

  const modal = activeSlide ? (
    <div
      className="character-gallery-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`${activeSlide.alt}の拡大表示`}
    >
      <button
        className="character-gallery-modal__backdrop"
        type="button"
        aria-label="拡大画像を閉じる"
        onClick={close}
      />
      <div className="character-gallery-modal__panel">
        <button
          className="character-gallery-modal__close"
          ref={closeButtonRef}
          type="button"
          aria-label="拡大画像を閉じる"
          onClick={close}
        >
          <X aria-hidden="true" size={24} />
        </button>

        <div className="character-gallery-modal__image">
          <Image
            src={activeSlide.full}
            alt={activeSlide.alt}
            width={600}
            height={activeSlide.height}
            sizes="(max-width: 760px) 92vw, min(88vw, 1200px)"
            priority
          />
        </div>

        <button
          className="character-gallery-modal__nav character-gallery-modal__nav--previous"
          type="button"
          aria-label="前の画像を表示"
          onClick={() =>
            setActiveIndex((current) =>
              current === null ? null : (current - 1 + slideCount) % slideCount,
            )
          }
        >
          <ChevronLeft aria-hidden="true" size={28} />
        </button>
        <button
          className="character-gallery-modal__nav character-gallery-modal__nav--next"
          type="button"
          aria-label="次の画像を表示"
          onClick={() =>
            setActiveIndex((current) =>
              current === null ? null : (current + 1) % slideCount,
            )
          }
        >
          <ChevronRight aria-hidden="true" size={28} />
        </button>
        <p className="character-gallery-modal__counter" aria-live="polite">
          {String((activeIndex ?? 0) + 1).padStart(2, "0")} / {slideCount}
        </p>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className="character-gallery" aria-label="講師実績スライド一覧">
        {slides.map((slide, index) => (
          <button
            className="character-gallery__item"
            key={slide.thumbnail}
            ref={(element) => {
              triggerRefs.current[index] = element;
            }}
            type="button"
            aria-label={`${slide.alt}を拡大表示`}
            onClick={() => setActiveIndex(index)}
          >
            <Image
              src={slide.thumbnail}
              alt=""
              fill
              sizes="(max-width: 760px) 38vw, 145px"
            />
          </button>
        ))}
      </div>

      {modal ? createPortal(modal, document.body) : null}
    </>
  );
}
