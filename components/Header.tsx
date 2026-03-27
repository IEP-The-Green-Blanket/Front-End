import Link from "next/link";
import HeaderButtonsBar from "./HeaderButtonsBar";

export default function Header() {
  return (
    <header className="site-header">

      {/* 'Mobile' layout */}
      <div className="header-inner mobile-header flex flex-col items-center w-full">

    {/* ---------- Home button ---------- */}
          <nav className="navLeftSide">
            {/* <Link href="/">Home</Link> */}
            <Link href="/">
              <img 
                src="/images/btn_home.png" 
                alt="oval-shaped button reading 'home' with a green frame and a house in the upper right corner."
                className="max-h-10 transition-transform duration-150 active:scale-90" />
            </Link>
          </nav>
          <Link href="/" className="logo-link">
            <img src="/images/Green_Blanket.png" alt="..." className="logo" />
          </Link>
          
      {/* ---------- Login and logout buttons ---------- */}
          <nav className="navRightSide">
            {/* <Link href="/">Login</Link> */}
            <Link href="/">
              <img 
                src="/images/btn_login.png" 
                alt="oval-shaped button reading 'login' with a greem frame and a person icon in the upper right corner."
                className="max-h-10 transition-transform duration-150 active:scale-90" />
            </Link>
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