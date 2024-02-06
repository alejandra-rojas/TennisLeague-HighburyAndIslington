import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import MenuModal from "./public/MenuModal";

function MenuButton() {
  gsap.registerPlugin(ScrollTrigger);
  const wrapRef = useRef(null);
  const svgRef = useRef(null);
  const ballRef = useRef(null);
  const [isBottom, setIsBottom] = useState(false);
  const [menuIsActive, setMenuIsActive] = useState(false);
  const [opacity, setOpacity] = useState(1);

  const resetOpacity = () => {
    setOpacity(1);
  };

  // Check if the user has scrolled to the bottom
  const checkScrollBottom = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setIsBottom(true);
    } else {
      setIsBottom(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollBottom);

    return () => {
      window.removeEventListener("scroll", checkScrollBottom);
    };
  }, []);

  // Rotate on scroll
  useEffect(() => {
    gsap.set([svgRef.current, ballRef.current], { transformOrigin: "50% 50%" });

    const rotation = gsap.timeline({
      scrollTrigger: {
        trigger: wrapRef.current,
        scrub: 1,
        start: "top top+=900",
        end: "+=10000",
      },
    });

    rotation
      .to(svgRef.current, {
        rotation: 360 * 5,
        duration: 0.1,
        ease: "linear",
      })
      .to(
        ballRef.current,
        { rotation: -360 * 5, duration: 0.1, ease: "linear" },
        "<"
      );

    return () => {
      rotation.kill();
    };
  }, []);

  // Rotate on hover
  useEffect(() => {
    const hoverAnim = gsap.to([svgRef.current, ballRef.current], {
      rotation: 360,
      duration: 4,
      ease: "linear",
      scrub: 1,
      paused: true,
      repeat: -1, // Infinite repeat
    });

    const startHover = () => hoverAnim.play();
    const stopHover = () => hoverAnim.pause();

    const circumfElem = document.querySelector(".circumf");
    circumfElem.addEventListener("mouseenter", startHover);
    circumfElem.addEventListener("mouseleave", stopHover);

    return () => {
      circumfElem.removeEventListener("mouseenter", startHover);
      circumfElem.removeEventListener("mouseleave", stopHover);
    };
  }, []);

  return (
    <>
      <span
        ref={wrapRef}
        className={`circumf ${isBottom ? "bottom-[50px] top-auto" : ""}`}
        onClick={() => {
          setMenuIsActive(true);
          setOpacity(0);
        }}
        style={{
          opacity: opacity,
          pointerEvents: opacity === 1 ? "auto" : "none",
        }}
      >
        <svg
          className="text"
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

          <text ref={svgRef} className="circles__text circles__font--1">
            <textPath
              className="circles__text-path"
              href="#circle-1"
              aria-label=""
              textLength="2830"
            >
              &nbsp;&nbsp;&nbsp;MENU
              &nbsp;&nbsp;&nbsp;MENU&nbsp;&nbsp;&nbsp;MENU
              &nbsp;&nbsp;&nbsp;MENU&nbsp;&nbsp;&nbsp;
            </textPath>
          </text>
        </svg>
        <svg
          width="49"
          height="49"
          viewBox="0 0 49 49"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="outer-circumference"
          ref={ballRef}
        >
          <path
            d="M48 24.5C48 37.4787 37.4787 48 24.5 48C11.5213 48 1 37.4787 1 24.5C1 11.5213 11.5213 1 24.5 1C37.4787 1 48 11.5213 48 24.5Z"
            stroke="#0F2D32"
            strokeWidth="1"
            fill="#d3fd6e"
          />
          <path
            d="M42.5939 31.5782C40.5886 31.2086 38.5438 30.3073 36.9802 29.1071C36.7761 28.9537 36.3099 28.5658 36.0678 28.323C32.1908 24.6725 31.0726 19.6071 29.9901 14.7053C28.9435 9.96721 27.8622 5.06619 24.2535 1.45801C24.1234 1.32746 24.0265 1.16872 23.9639 1C18.128 1.13087 12.3313 3.42263 7.87618 7.87788C3.42263 12.3322 1.1316 18.1282 1 23.9624C1.16872 24.0262 1.32584 24.1209 1.4585 24.2527C5.06725 27.8608 9.96745 28.9445 14.7067 29.9921C19.6076 31.0709 24.6734 32.1885 28.3383 36.0796C28.5159 36.2627 28.9908 36.8257 29.1123 36.9884C30.3091 38.5423 31.208 40.5903 31.5797 42.5931C31.8873 44.2573 31.8108 45.7495 31.364 46.9803C34.9353 45.8925 38.2965 43.9402 41.1162 41.1183C43.9398 38.2952 45.8925 34.9331 46.9802 31.3652C45.7499 31.8079 44.2602 31.8858 42.5939 31.5782Z"
            stroke="#0F2D32"
            strokeWidth="1"
            fill="#0f2d32"
          />
          <path
            d="M28.4281 47.0983C30.1108 45.4153 29.0729 40.9952 27.0902 38.4595C26.8658 38.1681 26.747 38.025 26.4012 37.6764C23.2726 34.4417 18.8509 33.4671 14.1672 32.4339C9.66874 31.4387 5.03554 30.4127 1.16481 27.3304C1.77273 32.3701 4.01045 37.2503 7.8764 41.1187C13.3851 46.6236 20.9417 48.8239 28.0912 47.7258C28.1421 47.4913 28.2548 47.2722 28.4281 47.0983Z"
            stroke="#0F2D32"
            strokeWidth="1"
            fill="#0f2d32"
          />
          <path
            d="M27.3333 1.16424C30.4119 5.03287 31.4396 9.66793 32.4327 14.1674C33.4679 18.8502 34.4432 23.2713 37.6701 26.3979L37.6881 26.4144C37.8285 26.5594 38.0123 26.7129 38.1908 26.8609C38.2905 26.9424 38.3848 27.0247 38.4743 27.1038C41.0132 29.0769 45.4195 30.1069 47.0997 28.4263C47.272 28.2544 47.4914 28.1402 47.7264 28.0917C48.8255 20.9404 46.6245 13.3845 41.1176 7.87738C37.2511 4.01191 32.3715 1.77331 27.3333 1.16424Z"
            stroke="#0F2D32"
            strokeWidth="1"
            fill="#0f2d32"
          />
        </svg>
      </span>

      <AnimatePresence>
        {menuIsActive && (
          <MenuModal
            menuIsActive={menuIsActive}
            handleClose={() => {
              setMenuIsActive(false);
              resetOpacity();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default MenuButton;

{
  /* <motion.div
            variants={{
              hidden: { left: 0 },
              visible: { left: "100%" },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: 1, ease: "easeIn" }}
            style={{
              position: "absolute",
              top: 6,
              bottom: 0,
              left: 0,
              right: 0,
              background: "#0f2d32",
              zIndex: 20,
            }}
          ></motion.div> */
}
