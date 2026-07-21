import Image from "next/image";
import { Mail, RadioTower } from "lucide-react";
import type { PortfolioContent } from "@/lib/portfolio";
import { textLines } from "@/lib/portfolio";
import type { WorkDetail } from "@/lib/work-details";
import { CyberpunkBackground } from "@/app/cyber-punk-background";
import { WorkDetailModal } from "@/components/work-detail-modal";

const navItems = [
  { label: "ABOUT", href: "#about" },
  { label: "WORKS", href: "#works" },
  { label: "EXP_LOG", href: "#experience" },
  { label: "CONTACT", href: "#contact" },
];

export function HeroSection() {
  return (
    <section className="hero cyber-panel" id="top" aria-label="First view">
      <CyberpunkBackground />

      {/* ④ Orbital ornaments — rotate in place at different periods */}
      <div className="hero__orbitals" aria-hidden="true">
        <div className="hero__orbital hero__orbital--01">
          <Image
            src="/assets/svg/orn-orbital-zoe-01.svg"
            alt=""
            fill
            sizes="60vw"
            unoptimized
            priority
          />
        </div>
        <div className="hero__orbital hero__orbital--02">
          <Image
            src="/assets/svg/orn-orbital-zoe-02.svg"
            alt=""
            fill
            sizes="72vw"
            unoptimized
            priority
          />
        </div>
      </div>

      {/* ① Brand — logo mark + wordmark */}
      <div className="hero__brand">
        <Image
          className="hero__logoMark"
          src="/assets/svg/logo-sw-ignite.svg"
          alt="SAWATRON"
          width={78}
          height={78}
          unoptimized
          priority
        />
        <span className="hero__logoText">SAWATRON</span>
        <span className="hero__tag">&gt; 9 products through creativity.</span>
      </div>

      <div className="hero__dial" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      {/* Hero centerpiece — bg-anim < machine < brand/nav */}
      <div className="hero__machine" aria-hidden="true">
        <Image
          src="/assets/hero/gp-ciber-machine-stream.webp"
          alt=""
          fill
          sizes="(max-width: 760px) 118vw, 74vw"
          priority
        />
      </div>

      {/* ②③ Navigation — metatron layer + sapphire mark */}
      <nav className="hero__nav" aria-label="Primary">
        {navItems.map((item) => (
          <a className="hex-link" href={item.href} key={item.href}>
            <Image
              className="hex-link__metatron"
              src="/assets/hero/orn-nav-metatron.png"
              alt=""
              width={80}
              height={80}
              aria-hidden="true"
              unoptimized
            />
            <span className="hex-link__label">
              {item.label}
              <Image
                className="hex-link__sapphire"
                src="/assets/svg/orn-sapphire.svg"
                alt=""
                width={28}
                height={28}
                aria-hidden="true"
                unoptimized
              />
            </span>
          </a>
        ))}
      </nav>
    </section>
  );
}

export function AboutSection({ content }: { content: PortfolioContent["about"] }) {
  return (
    <section className="about light-section" id="about">
      <SectionCode value={content.sectionCode} dark={false} />
      <div className="section-heading section-heading--light">
        <h1>
          {content.heading.text}
          <span>{content.heading.accent}</span>
        </h1>
        <div className="avatar-orbit" aria-hidden="true" />
      </div>

      <div className="about__grid">
        <div className="about__cards">
          {content.services.map((service) => (
            <article className="info-card" key={service.title}>
              <div className="info-card__head">
                <h2>{service.title}</h2>
                <span>{service.parameter}</span>
              </div>
              <p>{textLines(service.body)}</p>
            </article>
          ))}
        </div>

        <div className="metric-panel">
          {content.metrics.map((metric) => (
            <div className="metric" key={metric.label}>
              <span>{metric.label}</span>
              <i style={{ inlineSize: `${metric.value}%` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SkillsSection({ content }: { content: PortfolioContent["skills"] }) {
  return (
    <section className="skills light-section">
      <div className="section-heading section-heading--light">
        <h2>
          {content.heading.text}
          <span>{content.heading.accent}</span>
        </h2>
        <div className="avatar-orbit" aria-hidden="true" />
      </div>
      <div className="skills__body">
        <p>{textLines(content.description)}</p>
        <div className="skill-bank">
          <span>{content.bankLabel}</span>
          <div>
            {content.tags.map((skill) => (
              <b key={skill}>{skill}</b>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorksSection({ works }: { works: WorkDetail[] }) {
  return (
    <section className="works dark-section" id="works">
      <SectionCode value="// 02. WORKS" />
      <WorkDetailModal works={works} />
    </section>
  );
}

export function CharacterSection({ content }: { content: PortfolioContent["experience"] }) {
  return (
    <section className="character dark-section" id="experience">
      <div className="character__stage character__stage--experience">
        <Image
          className="character__bg"
          src="/assets/hero/ace-player.webp"
          alt=""
          fill
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="experience-panel">
          <SectionCode value={content.log.sectionCode} />
          {content.log.items.map((item) => (
            <article className="experience-item" key={`${item.year}-${item.title}`}>
              <time>{item.year}</time>
              <div>
                <h2>{item.title}</h2>
                <span>{item.company}</span>
                <p>{textLines(item.body)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="character__stage character__stage--profile">
        <Image
          className="character__bg"
          src="/assets/hero/ace-player-dark.webp"
          alt=""
          fill
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="character-copy">
          <SectionCode value={content.profile.sectionCode} />
          <h2>{content.profile.name}</h2>
          <p>{textLines(content.profile.body)}</p>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section className="contact" id="contact">
      <div className="contact__form">
        <SectionCode value="// 05. CONTACT" dark={false} />
        <h2>
          INITIATE <span>CONTACT</span>
        </h2>
        <form>
          <label>
            SENDER_ID
            <input type="text" name="name" placeholder="John Doe" />
          </label>
          <label>
            CHANNEL
            <input type="email" name="email" placeholder="you@domain.net" />
          </label>
          <label className="contact__message">
            MESSAGE_PAYLOAD
            <textarea name="message" placeholder="PROJECT / BUDGET / TIMELINE" />
          </label>
          <button type="submit" aria-label="問い合わせを送信">
            <Mail size={16} />
            SEND_TRANSMISSION
          </button>
        </form>
      </div>
      <div className="contact__image" aria-hidden="true">
        <Image src="/assets/hero/gp-ciber-machine-dogfight.webp" alt="" fill sizes="70vw" />
      </div>
    </section>
  );
}

export function Footer() {
  return <footer className="site-footer">© 2026 HAYATO_HYAMI — ENGINEERED IN THE VOID</footer>;
}

function SectionCode({ value, dark = true }: { value: string; dark?: boolean }) {
  return (
    <div className={dark ? "section-code" : "section-code section-code--light"}>
      <RadioTower size={12} />
      <span>{value}</span>
    </div>
  );
}
