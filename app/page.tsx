"use client";

import StatusDisplay from "@/components/StatusDisplay";
import style from "@/style/home.module.css";

export default function Home() {

  return (
    <main>
      <h1>
        Welcome!
      </h1>
      <div className={style.mainPage}>
        <p>The Green Blanket application is designed to inform you about the current status of the Hartbeespoortdam's water.</p>
      </div>
      <StatusDisplay status="safe"/>
    </main>
  )
}
