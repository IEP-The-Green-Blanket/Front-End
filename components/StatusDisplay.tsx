import React from "react";
import style from "@/style/home.module.css"

type Props = {
    status: "safe" | "unsafe";
}

const StatusDisplay: React.FC<Props> = ({ status }) => {
    return (
        <div className={style.statusWindow}>
            {status === "unsafe" ? (
                <p>The water at Hartbeespoortdam is safe! Please enjoy your swim!</p>
            ) : (
                <p>Entering the water at Hartbeespoortdam is currently discouraged.</p>
            )}
        </div>
    );
}; export default StatusDisplay;