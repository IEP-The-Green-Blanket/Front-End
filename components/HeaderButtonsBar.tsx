import Link from "next/link";

export default function HeaderButtonsBar() {
    return (
        <div className="w-full px-[0.5rem]">
            <ul className="flex w-full gap-4">
                <li className="flex-1 justify-center">
                    <Link href="/reporting">
                        <img 
                            src="/images/btn_alert_us.png" 
                            alt="oval-shaped button reading 'alert us' with a green frame and a megaphone in the upper right corner."
                            className="m-2 mt-0 max-h-12 transition-transform duration-150 active:scale-90" />
                    </Link>
                </li>
                <li className="flex-1 justify-center">
                    <Link href="/">
                        <img 
                            src="/images/btn_analysis.png" 
                            alt="oval-shaped button reading 'analysis' with a green frame and a chart in the upper right corner."
                            className="m-2 mt-0 max-h-12 transition-transform duration-150 active:scale-90" />
                    </Link>
                </li>
                <li className="flex-1 justify-center">
                    <Link href="/">
                        <img 
                            src="/images/btn_contact.png" 
                            alt="oval-shaped button reading 'contact' with a green frame and a information icon in the upper right corner."
                            className="m-2 mt-0 max-h-12 transition-transform duration-150 active:scale-90" />
                    </Link>
                </li>
            </ul>
        </div>
    );
}