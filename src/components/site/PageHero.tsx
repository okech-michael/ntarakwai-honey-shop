import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  image: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative h-[68vh] min-h-[460px] w-full overflow-hidden">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" width={1920} height={1080} />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/55 via-charcoal/35 to-charcoal/70" />
      <div className="container-luxe relative z-10 flex h-full flex-col items-start justify-end pb-16 pt-32 md:justify-center md:pb-0">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-cream/30 bg-cream/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-cream backdrop-blur">
          {eyebrow}
        </span>
        <h1 className="font-display max-w-4xl text-5xl font-medium leading-[1.05] text-cream md:text-6xl">{title}</h1>
        {subtitle && <p className="mt-5 max-w-2xl text-base text-cream/85 md:text-lg">{subtitle}</p>}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}
