import React, { useRef, useEffect } from "react";
import "../../styles/Public/BallElement.scss";
import gsap from "gsap";
import { BallOutline } from "../Icons";

function BallElement() {
  const svgRef = useRef(null);

  useEffect(() => {
    gsap.set(svgRef.current, { transformOrigin: "50% 50%" });

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

export default BallElement;
