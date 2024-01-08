import React, { useRef, useEffect } from "react";
import { useLenis } from "@studio-freight/react-lenis";
import gsap from "gsap";
import { BallOutline } from "./Icons";

function RotatingText() {
  const textRef = useRef(null);
  const circleText = "Highbury Fields - Doubles Leagues ";
  //   const lenis = useLenis((scroll) => {
  //     const speed = scroll.velocity;
  //   });
  const lenis = useLenis();
  console.log(lenis);

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

  useEffect(() => {
    // Listen to scroll updates from Lenis
    if (lenis) {
      lenis.on("scroll", ({ scroll }) => {
        // Adjust the GSAP animation based on scroll velocity
        gsap.to(textRef.current, {
          duration: 0.1, // Fast response to scroll change
          rotation: `+=${lenis.velocity}`, // Rotate based on scroll velocity
        });
      });
    }
  }, [lenis]);

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
