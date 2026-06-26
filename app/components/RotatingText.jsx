import React, { useRef, useEffect } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { BallOutline } from "./Icons";

function RotatingText() {
  const textRef = useRef(null);
  const circleText = "Highbury Fields - Doubles Leagues ";

  useLenis((lenis) => {
    if (!textRef.current) {
      return;
    }

    gsap.to(textRef.current, {
      duration: 0.1,
      rotation: `+=${lenis.velocity}`,
    });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.to(textRef.current, {
        rotation: 360,
        repeat: -1,
        duration: 25,
        ease: "linear",
      });
    }
  }, []);

  return (
    <div className="flex items-center justify-center py-10">
      <div
        ref={textRef}
        className="relative w-52 h-52 rounded-full flex items-center justify-center"
      >
        {circleText.split("").map((char, index) => (
          <span
            key={index}
            style={{ transform: `rotate(${index * 10.3}deg)` }}
            className="rotate-text"
          >
            {char}
          </span>
        ))}

        <span className="relative w-52 h-52 circle">
          <BallOutline />
          {/* <Ball fill="#0F2D32" /> */}
        </span>
      </div>
    </div>
  );
}

export default RotatingText;
