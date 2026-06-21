import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-charcoal text-cream">
      <div className="container-luxe grid gap-12 py-16 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-honey to-honey-deep text-charcoal">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2 L21 7 V17 L12 22 L3 17 V7 Z"/></svg>
            </span>
            <span className="font-display text-2xl">Honeyfield<span className="text-honey">.</span></span>
          </div>
          <p className="mt-4 text-sm text-cream/70 leading-relaxed">
            Premium honey and bee products, harvested naturally and delivered with care across Kenya and beyond.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-honey">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li><Link to="/about" className="hover:text-honey">About Us</Link></li>
            <li><Link to="/products" className="hover:text-honey">Products</Link></li>
            <li><Link to="/shop" className="hover:text-honey">Shop Online</Link></li>
            <li><Link to="/wholesale" className="hover:text-honey">Wholesale</Link></li>
            <li><Link to="/gallery" className="hover:text-honey">Gallery</Link></li>
            <li><Link to="/blog" className="hover:text-honey">Journal</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-honey">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-cream/80">
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-honey" /><a href="tel:+254711856795">+254 711 856 795</a></li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-honey" /><a href="mailto:hello@honeyfield.co.ke">hello@honeyfield.co.ke</a></li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-honey" />Nairobi, Kenya</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-honey">Visit</h4>
          <p className="mt-4 text-sm text-cream/80">Mon – Sat · 8:00 – 18:00 EAT</p>
          <Link to="/shop" className="btn-honey mt-5 text-sm">Shop Now</Link>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="container-luxe flex flex-col items-center justify-between gap-2 py-6 text-xs text-cream/55 md:flex-row">
          <span>© {new Date().getFullYear()} Honeyfield. All rights reserved.</span>
          <span>Pure · Natural · Trusted</span>
        </div>
      </div>
    </footer>
  );
}
