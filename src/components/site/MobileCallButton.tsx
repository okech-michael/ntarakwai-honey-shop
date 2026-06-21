import { Phone } from "lucide-react";

export function MobileCallButton() {
  return (
    <a
      href="tel:+254711856795"
      aria-label="Call us"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-honey to-honey-deep text-charcoal shadow-[0_20px_50px_-10px_oklch(0.5_0.18_55/0.55)] md:hidden"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-honey/60 opacity-60" />
      <Phone className="relative h-6 w-6" />
    </a>
  );
}
