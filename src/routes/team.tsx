import { createFileRoute, Link } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { useParallax } from "@/hooks/use-parallax";
import { PageHero } from "@/components/site/PageHero";
import { SectionHead } from "@/components/site/Story";
import { ArrowRight, Mail, Phone, Check } from "lucide-react";
import { BRAND, TEAM, SUPPORT_ROLES } from "@/lib/brand";
import beekeeper from "@/assets/beekeeper.jpg";
import mtKulal from "@/assets/mt-kulal.jpg";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Our Team: The People Behind Ntarakwai Beekeeping" },
      {
        name: "description",
        content:
          "Meet the Ntarakwai team: founder Ledany Timothy, apiary supervision, processing and quality control, and marketing, working out of Gatab, Mt. Kulal.",
      },
      { property: "og:title", content: "Our Team: Ntarakwai Beekeeping" },
      {
        property: "og:description",
        content: "The people producing, protecting and carrying Mt. Kulal honey.",
      },
      { property: "og:type", content: "article" },
      { property: "og:image", content: beekeeper },
      { name: "twitter:image", content: beekeeper },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/team" }],
  }),
  component: Team,
});

function Team() {
  useReveal();
  useParallax();

  return (
    <>
      <PageHero
        eyebrow="Our Team"
        image={beekeeper}
        title={
          <>
            Five people, one mountain, a very <em className="text-honey">clear</em> job.
          </>
        }
        subtitle="Ntarakwai is run from Gatab by a small team who live where the honey is made."
      />

      <section className="bg-background py-24 md:py-32">
        <div className="container-luxe">
          <SectionHead
            eyebrow="Leadership"
            title={
              <>
                The people <em className="text-honey-deep">behind the jar</em>.
              </>
            }
            intro="Transparency is one of our core values, so we would rather you knew exactly who is responsible for what."
          />

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {TEAM.map((m, i) => (
              <article
                key={m.name}
                className="reveal-slow overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-sm transition-transform duration-700 hover:-translate-y-1.5 md:p-10"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start gap-5">
                  <span className="font-display grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-honey to-honey-deep text-2xl text-charcoal shadow-md">
                    {m.initials}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl leading-tight text-charcoal">{m.name}</h3>
                    <div className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-honey-deep">
                      {m.role}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{m.expertise}</div>
                  </div>
                </div>

                <p className="mt-6 leading-relaxed text-muted-foreground">{m.bio}</p>

                <ul className="mt-6 space-y-2">
                  {m.duties.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-sm text-charcoal/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-honey-deep" />
                      {d}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap gap-2 border-t border-border pt-6">
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-2 text-xs font-semibold text-charcoal transition-colors hover:bg-secondary"
                  >
                    <Mail className="h-3.5 w-3.5" /> Email
                  </a>
                  {m.phone ? (
                    <a
                      href={m.phoneHref}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-2 text-xs font-semibold text-charcoal transition-colors hover:bg-secondary"
                    >
                      <Phone className="h-3.5 w-3.5" /> {m.phone}
                    </a>
                  ) : (
                    <a
                      href={BRAND.phoneHref}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-2 text-xs font-semibold text-charcoal transition-colors hover:bg-secondary"
                    >
                      <Phone className="h-3.5 w-3.5" /> {BRAND.phoneDisplay}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-24">
        <div className="container-luxe grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div className="reveal-slow overflow-hidden rounded-[2.5rem] shadow-[var(--shadow-luxe)]">
            <img
              src={mtKulal}
              alt="The ridge of Mt. Kulal above the plains"
              className="h-full w-full object-cover"
              loading="lazy"
              width={1920}
              height={1088}
            />
          </div>
          <div className="reveal-slow">
            <h2 className="font-display text-4xl leading-[1.07] text-charcoal md:text-5xl">
              And the hands that keep the shop <em className="text-honey-deep">running</em>.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Beyond the leadership team, day-to-day operations at Gatab are supported by staff
              whose work rarely gets named but shows up in every jar.
            </p>
            <ul className="mt-8 space-y-4">
              {SUPPORT_ROLES.map((r) => (
                <li key={r.title} className="rounded-2xl border border-border bg-card p-5">
                  <div className="font-display text-lg text-charcoal">{r.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{r.note}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
              As production grows, so does the team, creating employment for young people across
              Loiyangalani Ward is one of the reasons {BRAND.legalName} exists.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-20 text-cream">
        <div className="container-luxe reveal flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <h2 className="font-display max-w-2xl text-3xl leading-tight md:text-4xl">
            Want to work with us, supply us, or partner with us?
          </h2>
          <Link to="/contact" className="btn-honey">
            Get in touch <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
