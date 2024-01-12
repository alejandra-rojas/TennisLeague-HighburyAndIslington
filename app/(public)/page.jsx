"use client";
import "../styles/Public/styles.scss";
import { useLenis } from "@studio-freight/react-lenis";
import CourtHero from "../components/CourtHero";
import LatestResults from "../components/PublicData/LatestResults";

export default function Home() {
  //   const lenis = useLenis((scroll) => {
  //     console.log(scroll);
  //   });

  return (
    <main className="main-layout-client">
      <CourtHero />
      <div className="image-hero"></div>

      <div className="board">
        <div className="main-text">
          The league is designed to give match practice for external LTA
          competitions and to build confidence generally for all competitive
          play.
        </div>
      </div>

      <div className="latest-container">
        <div className="title">Latest results</div>
        <LatestResults />
      </div>
    </main>
  );
}
