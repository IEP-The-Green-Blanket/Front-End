import Header from "@/components/Header";
import "@/style/globals.css";

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
