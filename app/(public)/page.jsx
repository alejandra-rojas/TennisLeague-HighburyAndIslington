"use client";
import { TextRotating } from "../components/Icons";
import RotatingText from "../components/RotatingText";
import "../styles/Public/styles.scss";

export default function Home() {
  return (
    <main>
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
      <TextRotating />
      <RotatingText />
    </main>
  );
}
