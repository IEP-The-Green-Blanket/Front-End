import Header from "@/components/Header";
import "@/style/globals.css";

// this allows the user to download the app
export const metadata = {
  title: "Green Blanket",
  description: "Water Quality Monitoring System",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/public_images/green_blanket_logo.png",
  },
};

export const viewport = {
  themeColor: "#2e7d32",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <footer>
          © 2026 - The Green Blanket - Thanks to{" "}
          <a
            href="https://freedns.afraid.org/about-us/"
            style={{
              color: "blue",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            FreeDNS
          </a>{" "}
          for the domain name.
        </footer>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 1. GLOBAL PWA CATCHER: Steal the install prompt the exact millisecond it fires
              window.addEventListener('beforeinstallprompt', function(e) {
                e.preventDefault();
                window.deferredPwaPrompt = e;
              });

              // 2. SERVICE WORKER: Register for offline capabilities
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}