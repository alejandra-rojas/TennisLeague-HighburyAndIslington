"use client";
import "../styles/Public/styles.scss";
import { useLenis } from "@studio-freight/react-lenis";
import BallElement from "../components/BallElement";
import CourtHero from "../components/CourtHero";
import LatestResults from "../components/PublicData/LatestResults";
import MenuBtnMobile from "../components/MenuBtnMobile";

export default function Home() {
  //   const lenis = useLenis((scroll) => {
  //     console.log(scroll);
  //   });

  return (
    <main className="main-layout-client">
      <CourtHero />
      <div className="image-hero"></div>

      <div>Latest results</div>
      <LatestResults />
      <MenuBtnMobile />
    </main>
  );
}
