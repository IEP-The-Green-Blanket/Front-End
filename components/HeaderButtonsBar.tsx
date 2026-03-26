import Link from "next/link";

export default function HeaderButtonsBar() {
    return (
        <div className="w-full">
            <ul className="flex w-full gap-4">
                <li className="flex-1 justify-center">
                    <Link href="/reporting">
                        <img 
                            src="/images/btn_alert_us.png" 
                            alt="button reading alert us surrounded by a green frame with a megaphone in the corner."
                            className="m-2 mt-0 max-h-11 transition-transform duration-150 active:scale-90" />
                    </Link>
                </li>
            </ul>
        </div>
    );
}