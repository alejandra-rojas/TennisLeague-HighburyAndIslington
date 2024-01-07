import React, { useRef, useEffect } from "react";
import gsap from "gsap";

function RotatingText() {
  const textRef = useRef(null);

  const circleText = "Highbury Fields - Doubles Leagues ";

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
      </div>
    </div>
  );
}

export default RotatingText;
