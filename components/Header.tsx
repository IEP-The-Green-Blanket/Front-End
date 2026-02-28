import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white/10 backdrop-blur-md border-b border-white/20 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link href="/" className=" font-bold text-xl tracking-tight">
              🌿 Green Blanket
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className=" hover:text-gray-700 transition-colors">
              Home
            </Link>
            <Link
              href="/About_Us"
              className=" hover:text-gray-700 transition-colors"
            >
              About Us
            </Link>
          </nav>

          {/* Mobiele buttons */}
          <div className="md:hidden">
            <button className="p-2">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
