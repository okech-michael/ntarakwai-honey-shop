import type { ReactNode } from "react";

export function Eyebrow({
  children,
  tone = "dark",
}: {
  children: ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={`text-[11px] font-semibold uppercase tracking-[0.3em] ${
        tone === "light" ? "text-honey" : "text-honey-deep"
      }`}
    >
      {children}
    </span>
  );
}

export function SectionHead({
  eyebrow,
  title,
  intro,
  align = "center",
  tone = "dark",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "center" | "left";
  tone?: "dark" | "light";
}) {
  return (
    <div
      className={`reveal-slow ${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}
    >
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2
        className={`font-display mt-4 text-4xl leading-[1.08] md:text-5xl ${
          tone === "light" ? "text-cream" : "text-charcoal"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`mt-5 text-lg leading-relaxed ${tone === "light" ? "text-cream/75" : "text-muted-foreground"}`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}

/** Full-bleed cinematic band with a slow parallax image behind it. */
export function ParallaxBand({
  image,
  alt = "",
  speed = 0.18,
  overlay = "from-charcoal/85 via-charcoal/65 to-charcoal/85",
  className = "",
  children,
}: {
  image: string;
  alt?: string;
  speed?: number;
  overlay?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-[-12%]" data-parallax={String(speed)}>
        <img src={image} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className={`absolute inset-0 bg-gradient-to-b ${overlay}`} />
      <div className="container-luxe relative z-10">{children}</div>
    </section>
  );
}

export function StatRow({
  items,
}: {
  items: readonly { value: string; label: string; note?: string }[];
}) {
  return (
    <div className="grid gap-px overflow-hidden rounded-3xl border border-cream/15 bg-cream/10 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((s, i) => (
        <div
          key={s.label}
          className="reveal-slow bg-charcoal/70 p-7 backdrop-blur"
          style={{ transitionDelay: `${i * 110}ms` }}
        >
          <div className="font-display text-5xl text-honey">{s.value}</div>
          <div className="mt-2 text-sm font-medium text-cream">{s.label}</div>
          {s.note && <div className="mt-1 text-xs leading-relaxed text-cream/60">{s.note}</div>}
        </div>
      ))}
    </div>
  );
}
