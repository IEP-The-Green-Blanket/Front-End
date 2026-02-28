import Header from "@/components/Header";
import "@/style/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Header />
      <body>
        <main>{children}</main>
        <footer>© 2026 Green Blanket</footer>
      </body>
    </html>
  );
}
