import Header from "@/components/Header";
import "@/style/globals.css";

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
      </body>
    </html>
  );
}
