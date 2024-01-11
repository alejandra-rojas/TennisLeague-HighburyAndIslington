import React, { useRef, useEffect } from "react";
import "../styles/Public/BallElement.scss";
import gsap from "gsap";
import { BallOutline } from "./Icons";

function BallElement() {
  const svgRef = useRef(null);

  useEffect(() => {
    gsap.set(svgRef.current, { transformOrigin: "50% 50%" });

    // Initial rotation
    gsap.to(svgRef.current, {
      rotation: 360,
      repeat: -1,
      duration: 35,
      ease: "linear",
    });
  }, []);

  return (
    <span className="circumference">
      <svg
        className="circles"
        width="100%"
        height="100%"
        viewBox="0 0 1400 1400"
      >
        <def>
          <path
            id="circle-1"
            d="M250,700.5A450.5,450.5 0 1 11151,700.5A450.5,450.5 0 1 1250,700.5"
          />
        </def>

        <text ref={svgRef} className="circles__text circles__text--1">
          <textPath
            className="circles__text-path"
            href="#circle-1"
            aria-label=""
            textLength="2830"
          >
            &nbsp;&nbsp;&nbsp;Highbury Tennis Club&nbsp;&nbsp;&nbsp; Doubles
            League
          </textPath>
        </text>
      </svg>
      <BallOutline />
    </span>
  );
}

/* function BallElement() {
  useEffect(() => {
    // Set initial styles using GSAP
    gsap.set("text.circles__text", { transformOrigin: "50% 50%" });

    // Create an animation
    gsap.to("text.circles__text", {
      duration: 50,
      ease: "none",
      rotation: "+=360",
      repeat: -1,
    });
  }, []);

  return (
    <svg className="circles" width="100%" height="100%" viewBox="0 0 1400 1400">
      <def>
        <path
          id="circle-1"
          d="M250,700.5A450.5,450.5 0 1 11151,700.5A450.5,450.5 0 1 1250,700.5"
        />
        <path
          id="circle-2"
          d="M382,700.5A318.5,318.5 0 1 11019,700.5A318.5,318.5 0 1 1382,700.5"
        />
        <path
          id="circle-3"
          d="M487,700.5A213.5,213.5 0 1 1914,700.5A213.5,213.5 0 1 1487,700.5"
        />
        <path
          id="circle-4"
          d="M567.5,700.5A133,133 0 1 1833.5,700.5A133,133 0 1 1567.5,700.5"
        />
      </def>
      <text className="circles__text circles__text--1">
        <textPath
          className="circles__text-path"
          href="#circle-1"
          aria-label=""
          textLength="2830"
        >
          And now this tree of&nbsp;&nbsp;&nbsp; ours tall in the road&nbsp;
        </textPath>
      </text>
      <text className="circles__text circles__text--2">
        <textPath
          className="circles__text-path"
          href="#circle-2"
          aria-label=""
          textLength="2001"
        >
          Depth over distance every time&nbsp;
        </textPath>
      </text>
      <text className="circles__text circles__text--3">
        <textPath
          className="circles__text-path"
          href="#circle-3"
          aria-label=""
          textLength="1341"
        >
          But it's the roots that will bind us here&nbsp;
        </textPath>
      </text>
      <text className="circles__text circles__text--4">
        <textPath
          className="circles__text-path"
          href="#circle-4"
          aria-label=""
          textLength="836"
        >
          Depth over distance was all I asked of you&nbsp;
        </textPath>
      </text>
    </svg>
  );
} */

export default BallElement;
