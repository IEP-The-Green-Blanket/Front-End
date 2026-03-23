import Link from "next/link";
import HeaderButtonsBar from "./HeaderButtonsBar";

export default function Header() {
  return (
    <header className="site-header">

      {/* 'Mobile' layout */}
      <div className="header-inner mobile-header flex flex-col items-center w-full">
          <nav className="navLeftSide">
            <Link href="/">Home</Link>
          </nav>
          <Link href="/" className="logo-link">
            <img src="/images/Green_Blanket.png" alt="..." className="logo" />
          </Link>
          <nav className="navRightSide">
            <Link href="/">Login</Link>
          </nav>
      </div>
      <HeaderButtonsBar/>

      {/* 'Desktop' layout */}
      <div className="header-inner desktop-header">
        <Link href="/" className="logo-link">
          <img src="/images/Green_Blanket.png" alt="..." className="logo" />
        </Link>
        <div className="nav-group">
          <nav className="navLeftSide">
            <Link href="/">Home</Link>
          </nav>
          <nav className="navRightSide">
            <Link href="/">Login</Link>
          </nav>
        </div>
      </div>

    </header>
  );
}