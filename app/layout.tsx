import type { Metadata, Viewport } from "next";
import "./globals.css";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      link: any;
    }
  }
}

export const metadata: Metadata = {
  title: "Vibe Travel - Discover Nearby Places",
  description: "Discover interesting places around you. Find parks, scenic lookouts, historic sites, and hidden beaches nearby.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Vibe Travel",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  themeColor: "#6B3FD1",
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Vibe Travel" />
        <meta name="theme-color" content="#6B3FD1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link href="https://api.mapbox.com/mapbox-gl/v3.1.0/mapbox-gl.css" rel="stylesheet" />
        <script src="https://api.mapbox.com/mapbox-gl/v3.1.0/mapbox-gl.js"></script>
      </head>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}

function ServiceWorkerRegistration() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js').then(
                (registration) => {
                  console.log('Service Worker registered:', registration);
                },
                (error) => {
                  console.log('Service Worker registration failed:', error);
                }
              );
            });
          }
        `,
      }}
    />
  );
}
