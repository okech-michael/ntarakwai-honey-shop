import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import logo from "@/assets/logo.jpg";

const NAV = [
  { type: "link", to: "/", label: "Home" },
  {
    type: "dropdown",
    label: "Our Story",
    items: [
      { to: "/about", label: "Our Story" },
      { to: "/team", label: "Our Team" },
    ],
  },
  { type: "link", to: "/products", label: "Products" },
  { type: "link", to: "/process", label: "Our Process" },
  {
    type: "dropdown",
    label: "Impact",
    items: [
      { to: "/community", label: "Community" },
      { to: "/sustainability", label: "Conservation" },
    ],
  },
  { type: "link", to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState<"story" | "impact" | null>(null);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<"story" | "impact" | null>(null);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border/60 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container-luxe grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 md:grid-cols-[auto_1fr_auto] md:gap-4">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-[#2f7041] bg-cream/95 shadow-sm sm:h-14 sm:w-14">
            <img
              src={logo}
              alt="Ntarakwai Beekeeping Limited logo"
              className="absolute left-[-50%] top-[-42%] h-[168%] w-[200%] max-w-none object-fill"
            />
          </span>
          <span className="font-display whitespace-nowrap text-base font-semibold tracking-tight text-charcoal sm:text-lg xl:text-xl">
            Ntarakwai Beekeeping Limited
            <span className="text-honey-deep">.</span>
          </span>
        </Link>

        <nav className="hidden items-center justify-center gap-1 md:flex xl:gap-2">
          {NAV.map((item) => {
            if (item.type === "link") {
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-full px-3 py-2 text-sm font-medium text-foreground/75 transition-colors hover:text-charcoal xl:px-4"
                  activeProps={{ className: "text-charcoal bg-secondary" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              );
            }

            const isOpen = activeDesktopDropdown === (item.label === "Our Story" ? "story" : "impact");

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveDesktopDropdown(item.label === "Our Story" ? "story" : "impact")}
                onMouseLeave={() => setActiveDesktopDropdown(null)}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setActiveDesktopDropdown(isOpen ? null : item.label === "Our Story" ? "story" : "impact")}
                  className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-foreground/75 transition-colors hover:text-charcoal xl:px-4"
                >
                  <span>{item.label}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <div className="absolute left-0 top-full z-50 mt-2 min-w-44 rounded-2xl border border-border bg-background p-2 shadow-lg">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.to}
                        to={subItem.to}
                        className="block rounded-xl px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-secondary hover:text-charcoal"
                        activeProps={{ className: "bg-secondary text-charcoal" }}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/shop/cart"
            aria-label="Cart"
            className="relative grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-charcoal transition-colors hover:bg-secondary"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-honey-deep px-1 text-[10px] font-bold text-cream">
                {count}
              </span>
            )}
          </Link>
          <Link to="/shop" className="btn-honey text-sm">
            <ShoppingBag className="h-4 w-4" />
            Shop Now
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/shop/cart"
            aria-label="Cart"
            className="relative grid h-11 w-11 place-items-center rounded-full bg-secondary text-charcoal"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-honey-deep px-1 text-[10px] font-bold text-cream">
                {count}
              </span>
            )}
          </Link>
          <button
            aria-label="Open menu"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary text-charcoal"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden">
          <div className="container-luxe mt-3 rounded-3xl border border-border bg-background p-4 shadow-xl">
            <nav className="flex flex-col gap-2">
              {NAV.map((item) => {
                if (item.type === "link") {
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-4 py-3 text-base font-medium text-foreground/80"
                      activeProps={{ className: "bg-secondary text-charcoal" }}
                      activeOptions={{ exact: item.to === "/" }}
                    >
                      {item.label}
                    </Link>
                  );
                }

                const isOpen = activeMobileDropdown === (item.label === "Our Story" ? "story" : "impact");

                return (
                  <div key={item.label} className="rounded-xl border border-border bg-card">
                    <button
                      type="button"
                      onClick={() => setActiveMobileDropdown(isOpen ? null : item.label === "Our Story" ? "story" : "impact")}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-base font-medium text-foreground/80"
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="border-t border-border px-2 pb-2 pt-1">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.to}
                            to={subItem.to}
                            onClick={() => setOpen(false)}
                            className="block rounded-lg px-3 py-2.5 text-sm text-foreground/75 hover:bg-secondary hover:text-charcoal"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <Link to="/shop" onClick={() => setOpen(false)} className="btn-honey mt-2 text-sm">
                <ShoppingBag className="h-4 w-4" />
                Shop Now
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
