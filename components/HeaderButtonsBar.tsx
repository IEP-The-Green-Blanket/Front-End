import Link from "next/link";

export default function HeaderButtonsBar() {
    return (
        <div className="w-full">
            <ul className="flex w-full gap-4">
                <li className="flex-1 text-center">
                    <Link href="/reporting">
                        <img 
                            src="/images/alert_btn.png" 
                            alt="button reading alert us surrounded by a green frame with a megaphone in the corner."
                            className="m-2 max-h-10" />
                    </Link>
                </li>
            </ul>
        </div>

    );
}