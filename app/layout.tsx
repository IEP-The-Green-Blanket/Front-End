import "@/style/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav>
          <h1>Our website</h1>
        </nav>
        <main>{children}</main>
        <footer>© 2026 Green Blanket</footer>
      </body>
    </html>
  );
}
