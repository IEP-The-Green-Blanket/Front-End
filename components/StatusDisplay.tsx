import React from "react";
import style from "@/style/home.module.css"

type Props = {
    status: "safe" | "unsafe" | "dangerous";
}

const StatusDisplay: React.FC<Props> = ({ status }) => {
    const statusClass = {
        safe : style.statSafe,
        unsafe: style.statUnsafe,
        dangerous: style.statDangerous,
    }[status];

    return (
        <>
            <img className={style.alertIcon} src={status === "safe" ? (
                '/images/success-green-check-mark-icon.svg'
            ) : status === "dangerous" ? (
                '/images/red-x-line-icon.svg'
            ) : ( '/images/caution-icon.svg'
                
            )}/>
            <div className={`${style.statusWindow} ${statusClass}`}>
                <p>Currently, the quality of Hartbeespoortdam's water is considered {status}. </p>
                <div className={style.message}>
                    {status === "safe" ? (
                        <p>Please enjoy your swim!</p>
                    ) : status === "dangerous" ? (
                        <p>Entering the water is prohibited.</p>
                    ): (
                        <p>Entering the water is discouraged.</p>
                    )}
                </div>
            </div>
        </>
    );
}; export default StatusDisplay;