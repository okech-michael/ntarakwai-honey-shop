import React from "react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.jpeg";
import terraseptLogo from "@/assets/terrasept-logo.png";

interface PaymentShellProps {
  children: React.ReactNode;
  stepTitle?: string;
  onBack?: () => void;
  backHref?: string;
  showBack?: boolean;
}

export function PaymentShell({
  children,
  stepTitle,
  onBack,
  backHref = "/shop/cart",
  showBack = true,
}: PaymentShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-honey/30">
      {/* Top Minimal Header */}
      <header className="border-b border-border/70 bg-background/90 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-2xl px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src={logo}
              alt="Ntarakwai"
              className="h-8 w-8 rounded-full object-cover border border-border"
            />
            <span className="font-display text-lg tracking-tight text-charcoal font-semibold">
              Ntarakwai
            </span>
          </Link>

          <div className="flex items-center gap-3 text-xs">
            {showBack && (
              onBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="text-muted-foreground hover:text-charcoal transition font-medium"
                >
                  ← Back
                </button>
              ) : (
                <Link
                  to={backHref}
                  className="text-muted-foreground hover:text-charcoal transition font-medium"
                >
                  Cancel
                </Link>
              )
            )}
          </div>
        </div>
      </header>

      {/* Main Payment Canvas */}
      <main className="flex-1 flex flex-col justify-center py-10 px-5 sm:px-6">
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </main>

      {/* Footer / Attribution */}
      <footer className="border-t border-border/60 py-6 px-5 bg-background">
        <div className="mx-auto max-w-md text-center flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <span>Mt. Kulal, Marsabit County · Kenya</span>
          <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition">
            <span>Payments infrastructure by</span>
            <img
              src={terraseptLogo}
              alt="TerraSept Solutions"
              className="h-3.5 w-auto object-contain inline-block"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
