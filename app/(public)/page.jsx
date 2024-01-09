"use client";
import Lenis from "@studio-freight/lenis";
import { TextRotating } from "../components/Icons";
import RotatingText from "../components/RotatingText";
import "../styles/Public/styles.scss";
import { useLenis } from "@studio-freight/react-lenis";
import BallElement from "../components/BallElement";
import CourtHero from "../components/CourtHero";

export default function Home() {
  //   const lenis = useLenis((scroll) => {
  //     console.log(scroll);
  //   });

  return (
    <main className="main-layout-client">
      <CourtHero />
      <div className="image-hero"></div>

      <div className="end">a</div>
      {/* <TextRotating /> */}
      {/* <RotatingText /> */}
    </main>
  );
}
