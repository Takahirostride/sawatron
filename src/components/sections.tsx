import Image from "next/image";
import { ArrowUpRight, Mail, RadioTower } from "lucide-react";
import type { PortfolioPost } from "@/lib/wordpress";
import { CyberpunkBackground } from "@/app/cyber-punk-background";

const navItems = [
  { label: "ABOUT", href: "#about" },
  { label: "WORKS", href: "#works" },
  { label: "EXP_LOG", href: "#experience" },
  { label: "CONTACT", href: "#contact" },
];

const services = [
  {
    title: "PROJECT MANAGER",
    body: "要件定義・進行管理・品質設計を横断し、Webサービスの実装と運用を同じテーブルで設計します。",
  },
  {
    title: "WEB ENGINEERING",
    body: "Next.js、Laravel、WordPress REST API を中心に、編集体験と表示速度を両立する実装を組みます。",
  },
  {
    title: "UI/UX DESIGN",
    body: "情報設計、導線、コンポーネント粒度を整理し、ユーザーが迷わないプロダクト体験へ落とし込みます。",
  },
  {
    title: "WEB DIRECTION",
    body: "事業目標、コンテンツ運用、SEO、保守性を接続し、長期運用できる制作フローを設計します。",
  },
];

const skills = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "SCSS",
  "WordPress",
  "REST API",
  "Vercel",
  "Laravel",
  "UI Design",
  "SEO",
  "Performance",
];

const experience = [
  ["2026", "SENIOR SYSTEMS ARCHITECT", "SAWATRON LAB"],
  ["2024", "PRINCIPAL ENGINEER", "JUNKTIONS"],
  ["2022", "WEB DIRECTOR", "CREATIVE OPS"],
  ["2020", "SYSTEMS ENGINEER", "GRID SYSTEMS"],
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
          src="/assets/hero/gp-ciber-machine-stream.png"
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

export function AboutSection() {
  return (
    <section className="about light-section" id="about">
      <SectionCode value="// 01. WHO" dark={false} />
      <div className="section-heading section-heading--light">
        <h1>
          WHO AM I<span>?</span>
        </h1>
        <div className="avatar-orbit" aria-hidden="true" />
      </div>

      <div className="about__grid">
        <div className="about__cards">
          {services.map((service) => (
            <article className="info-card" key={service.title}>
              <div className="info-card__head">
                <h2>{service.title}</h2>
                <span>12 year</span>
              </div>
              <p>{service.body}</p>
            </article>
          ))}
        </div>

        <div className="metric-panel">
          {["SYSTEMS ENGINEERING", "INTERACTION SYSTEMS", "FRONTEND ENGINEERING", "COPYWRITING", "BRAND DESIGN", "DATA DIRECTION"].map(
            (label, index) => (
              <div className="metric" key={label}>
                <span>{label}</span>
                <i style={{ inlineSize: `${92 - index * 6}%` }} />
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

export function SkillsSection() {
  return (
    <section className="skills light-section">
      <div className="section-heading section-heading--light">
        <h2>
          SKILL<span>S</span>
        </h2>
        <div className="avatar-orbit" aria-hidden="true" />
      </div>
      <div className="skills__body">
        <p>
          事業要件・UI/UX・実装を横断し、Webサービスの立ち上げと改善に必要なレイヤーを一気通貫で扱います。
          表示速度、運用性、保守性、デザイン品質を同時に詰めるための技術選定と設計を重視しています。
        </p>
        <div className="skill-bank">
          <span>TECH STACK</span>
          <div>
            {skills.map((skill) => (
              <b key={skill}>{skill}</b>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorksSection({ posts }: { posts: PortfolioPost[] }) {
  return (
    <section className="works dark-section" id="works">
      <SectionCode value="// 02. WORKS" />
      <div className="works__rail">
        {posts.slice(0, 2).map((post) => (
          <article className="work-card" key={post.id}>
            <div className="work-card__image">
              {post.image ? (
                <Image
                  src={post.image}
                  alt=""
                  fill
                  sizes="(max-width: 760px) 86vw, 460px"
                  unoptimized={!post.image.startsWith("/")}
                />
              ) : null}
            </div>
            <div className="work-card__content">
              <h2>{post.title}</h2>
              <time>{post.date}</time>
              <p>{post.excerpt}</p>
              <div className="work-card__tags">
                {post.tags.slice(0, 6).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <a href="#" aria-label={`${post.title} の詳細`}>
                <ArrowUpRight size={16} />
                詳細
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function CharacterSection() {
  return (
    <section className="character dark-section" id="experience">
      <div className="character__figure" aria-hidden="true">
        <div className="character__halo" />
        <div className="character__person" />
      </div>

      <div className="character__stage character__stage--experience">
        <div className="experience-panel">
          <SectionCode value="// 03. EXPERIENCE_LOG" />
          {experience.map(([year, title, company]) => (
            <article className="experience-item" key={`${year}-${title}`}>
              <time>{year}</time>
              <div>
                <h2>{title}</h2>
                <span>{company}</span>
                <p>High-density digital product development and operations architecture.</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="character__stage character__stage--profile">
        <div className="character-copy">
          <SectionCode value="// 04. CHARACTER" />
          <h2>HAYATO_HYAMI</h2>
          <p>
            Fast-moving digital products need design, engineering, content operations, and deployment to move as one system.
            I connect those layers and build interfaces that can keep shipping after release.
          </p>
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
        <Image src="/assets/hero/gp-ciber-machine-dogfight.png" alt="" fill sizes="70vw" />
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
