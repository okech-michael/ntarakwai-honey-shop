import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.jpeg";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-charcoal text-cream">
      <div className="container-luxe grid gap-12 py-16 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <img
              src={logo}
              alt="Ntarakwai Pure & Natural Honey logo"
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
            <span className="font-display text-2xl">Ntarakwai Pure & Natural Honey<span className="text-honey">.</span></span>
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
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-honey" /><a href="tel:+254711856795">0711856795</a></li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-honey" /><a href="mailto:ntarakwai2023@gmail.com">ntarakwai2023@gmail.com</a></li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-honey" />Mt. Kulal, Kenya</li>
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
          <span>© {new Date().getFullYear()} Ntarakuwai Pure & Natural Honey. All rights reserved.</span>
          <span>Pure · Natural · Trusted</span>
        </div>
      </div>
    </footer>
  );
}
