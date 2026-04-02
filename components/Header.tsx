import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      {/* 'Mobile' layout */}
      <div className="headerGrid">
        <img 
          src="/images/green_wrt.png"
          className="max-w-21"
          alt="" />
        <Link href="/" className="logo-link">
          <img 
            src="/images/Green_Blanket.png" 
            alt="..." 
            className="logo fuseColTwo" />
        </Link>
        <img 
          src="/images/blanket_wrt.png" 
          alt="" />
        <Link href="/">
          <img 
            src="/images/btn_home.png" 
            alt="oval-shaped button reading 'home' with a green frame and a house in the upper right corner."
            className="transition-transform duration-15 active:scale-90" />
        </Link>
        <Link href="/login">
          <img 
            src="/images/btn_login.png" 
            alt="oval-shaped button reading 'login' with a greem frame and a person icon in the upper right corner."
            className="transition-transform duration-15 active:scale-90" />
        </Link>
        <Link href="/reporting">
          <img 
            src="/images/btn_alert_us.png" 
            alt="oval-shaped button reading 'alert us' with a green frame and a megaphone in the upper right corner."
            className="transition-transform duration-15 active:scale-90" />
        </Link>
        <Link href="/analysis">
          <img 
            src="/images/btn_analysis.png" 
            alt="oval-shaped button reading 'analysis' with a green frame and a chart in the upper right corner."
            className="transition-transform duration-15 active:scale-90" />
        </Link>
        <Link href="/">
          <img 
            src="/images/btn_contact.png" 
            alt="oval-shaped button reading 'contact' with a green frame and a information icon in the upper right corner."
            className="max-h-8 transition-transform duration-15 active:scale-90" />
        </Link>
      </div>

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