"use client";
import Lenis from "@studio-freight/lenis";
import { TextRotating } from "../components/Icons";
import RotatingText from "../components/RotatingText";
import "../styles/Public/styles.scss";
import { useLenis } from "@studio-freight/react-lenis";
import BallElement from "../components/BallElement";

export default function Home() {
  //   const lenis = useLenis((scroll) => {
  //     console.log(scroll);
  //   });

  return (
    <main className="">
      <div className="court">
        <div className="div1"> </div>
        <div className="div2"> </div>
        <div className="div3"> </div>
        <div className="div4"> </div>
        <div className="div5"> </div>
        <div className="div6"> </div>
        <div className="div7"> </div>
        <div className="div8"> </div>
        <div className="div9"> </div>
        <div className="div10"> </div>
      </div>
      <div>
        <div className="title">
          Highbury Tennis Club runs a thriving doubles league for its women
          members.
        </div>
        <div className="subtitle">
          The league is designed to give match practice for external LTA
          competitions and to build confidence generally for all competitive
          play.
        </div>
      </div>

      {/* <TextRotating /> */}
      {/* <RotatingText /> */}

      <div className="end"></div>
    </main>
  );
}
