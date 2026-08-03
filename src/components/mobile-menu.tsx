"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const mobileMenuItems = [
  { label: "ABOUT", code: "01", href: "#about" },
  { label: "WORKS", code: "02", href: "#works" },
  { label: "EXP_LOG", code: "03", href: "#experience" },
  { label: "CONTACT", code: "04", href: "#contact" },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="mobile-menu">
      <button
        className="mobile-menu__trigger"
        type="button"
        aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu-layer"
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {isOpen ? (
        <div className="mobile-menu__layer" id="mobile-menu-layer">
          <div className="mobile-menu__panel">
            <span className="mobile-menu__eyebrow">{"// MOBILE_NAV"}</span>
            <nav aria-label="Mobile primary navigation">
              {mobileMenuItems.map((item) => (
                <a href={item.href} key={item.href} onClick={() => setIsOpen(false)}>
                  <span>{item.code}</span>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}
