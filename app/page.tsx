"use client";

import StatusDisplay from "@/components/StatusDisplay";

export default function Home() {

  return (
    <main>
      <h1>
        Welcome!
      </h1>
      <div className="mainPage">
        <p>The Green Blanket application is designed to inform you about the current status of the dam's water. </p>
      </div>
      <StatusDisplay status="safe"/>
    </main>
  )
}
