"use client";
import { ReactLenis } from "lenis/react";

function SmoothScroll({ children }) {
  return (
    <ReactLenis root options={{ smoothTouch: true, syncTouch: true }}>
      {children}
    </ReactLenis>
  );
}

export default SmoothScroll;
