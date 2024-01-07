"use client";
import { TextRotating } from "../components/Icons";
import RotatingText from "../components/RotatingText";
import "../styles/Public/styles.scss";

export default function Home() {
  return (
    <main>
      <div class="court">
        <div class="div1"> </div>
        <div class="div2"> </div>
        <div class="div3"> </div>
        <div class="div4"> </div>
        <div class="div5"> </div>
        <div class="div6"> </div>
        <div class="div7"> </div>
        <div class="div8"> </div>
        <div class="div9"> </div>
        <div class="div10"> </div>
      </div>
      <TextRotating />
      <RotatingText />
    </main>
  );
}
