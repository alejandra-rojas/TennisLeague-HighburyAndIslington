"use client";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";

function SmoothScroll({ children }) {
  // const lenis = useLenis(({ scroll }) => {
  //   // called every scroll
  //   console.log("lenis", lenis.velocity);
  // });

  return (
    <ReactLenis root options={{ lerp: 0.1, smoothTouch: true }}>
      {children}
    </ReactLenis>
  );
}

export default SmoothScroll;
