import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ntarakwai Pure & Natural Honey — Premium Honey & Bee Products" },
      { name: "description", content: "Pure natural honey, beeswax, propolis and bee pollen from trusted Kenyan beekeepers. Wholesale and retail supply." },
      { name: "author", content: "Ntarakwai Pure & Natural Honey" },
      { property: "og:title", content: "Ntarakwai Pure & Natural Honey — Premium Honey & Bee Products" },
      { property: "og:description", content: "Pure natural honey, beeswax, propolis and bee pollen from trusted Kenyan beekeepers. Wholesale and retail supply." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Ntarakwai Pure & Natural Honey — Premium Honey & Bee Products" },
      { name: "twitter:description", content: "Pure natural honey, beeswax, propolis and bee pollen from trusted Kenyan beekeepers. Wholesale and retail supply." },
      { property: "og:image", content: "/logo.jpeg" },
      { name: "twitter:image", content: "/logo.jpeg" },
      { name: "application-name", content: "Ntarakwai Pure & Natural Honey" },
      { name: "apple-mobile-web-app-title", content: "Ntarakwai Pure & Natural Honey" },
      { name: "theme-color", content: "#F6E7C2" },
    ],
    links: [
      { rel: "icon", href: "/logo.jpeg", type: "image/jpeg" },
      { rel: "shortcut icon", href: "/logo.jpeg", type: "image/jpeg" },
      { rel: "apple-touch-icon", href: "/logo.jpeg" },
      { rel: "mask-icon", href: "/logo.jpeg" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "icon", href: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ntarakwai Pure & Natural Honey — Premium Honey & Bee Products" },
      { name: "description", content: "Pure natural honey, beeswax, propolis and bee pollen from trusted Kenyan beekeepers. Wholesale and retail supply." },
      { name: "author", content: "Ntarakwai Pure & Natural Honey" },
      { property: "og:title", content: "Ntarakwai Pure & Natural Honey — Premium Honey & Bee Products" },
      { property: "og:description", content: "Pure natural honey, beeswax, propolis and bee pollen from trusted Kenyan beekeepers. Wholesale and retail supply." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Ntarakwai Pure & Natural Honey — Premium Honey & Bee Products" },
      { name: "twitter:description", content: "Pure natural honey, beeswax, propolis and bee pollen from trusted Kenyan beekeepers. Wholesale and retail supply." },
      { property: "og:image", content: "/logo.jpeg" },
      { name: "twitter:image", content: "/logo.jpeg" },
      { name: "application-name", content: "Ntarakwai Pure & Natural Honey" },
      { name: "apple-mobile-web-app-title", content: "Ntarakwai Pure & Natural Honey" },
      { name: "theme-color", content: "#F6E7C2" },
    ],
    links: [
      { rel: "icon", href: "/logo.jpeg", type: "image/jpeg" },
      { rel: "shortcut icon", href: "/logo.jpeg", type: "image/jpeg" },
      { rel: "apple-touch-icon", href: "/logo.jpeg" },
      { rel: "mask-icon", href: "/logo.jpeg" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          <main>
            <Outlet />
          </main>
          <Footer />
          <MobileCallButton />
        </div>
      </CartProvider>
    </QueryClientProvider>
  );
}
