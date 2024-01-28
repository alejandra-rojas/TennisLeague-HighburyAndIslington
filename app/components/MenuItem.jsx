import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { BallOutline } from "./Icons";

const mountAnim = { initial: "initial", animate: "enter", exit: "exit" };

const rotateX = {
  initial: {
    rotateX: 90,
    opacity: 0,
  },
  enter: (i) => ({
    rotateX: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1],
      delay: 0.3 + i * 0.05,
    },
  }),
  exit: {
    opacity: 0,
    transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
  },
};

function MenuItem({ data, index }) {
  const { title, slug, description, images } = data;
  const outer = useRef(null);
  const inner = useRef(null);

  const manageMouseEnter = (e) => {
    const bounds = e.target.getBoundingClientRect();
    if (e.clientY < bounds.top + bounds.height / 2) {
      gsap.set(outer.current, { top: "-100%" });
      gsap.set(inner.current, { top: "100%" });
    } else {
      gsap.set(outer.current, { top: "100%" });
      gsap.set(inner.current, { top: "-100%" });
    }
    gsap.to(outer.current, { top: "0%", duration: 0.3 });
    gsap.to(inner.current, { top: "0%", duration: 0.3 });
  };

  const manageMouseLeave = (e) => {
    const bounds = e.target.getBoundingClientRect();
    if (e.clientY < bounds.top + bounds.height / 2) {
      gsap.to(outer.current, { top: "-100%", duration: 0.3 });
      gsap.to(inner.current, { top: "100%", duration: 0.3 });
    } else {
      gsap.to(outer.current, { top: "100%", duration: 0.3 });
      gsap.to(inner.current, { top: "-100%", duration: 0.3 });
    }
  };

  return (
    <motion.div
      onMouseEnter={(e) => {
        manageMouseEnter(e);
      }}
      onMouseLeave={(e) => {
        manageMouseLeave(e);
      }}
      variants={rotateX}
      {...mountAnim}
      custom={index}
      className="el"
    >
      {/* <Image src={`/images/contact1.jpg`} fill alt="image" /> */}

      <Link href={slug}>
        {title}
        <div ref={outer} className="outer">
          <div ref={inner} className="inner">
            {[...Array(2)].map((_, index) => {
              return (
                <div key={index} className="container">
                  {/* <div className="imageContainer">
                  <BallOutline />
                </div> */}
                  <p>{description}</p>
                  <div className="imageContainer">
                    <BallOutline />
                  </div>
                  {/*  <p>{description}</p> */}
                </div>
              );
            })}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default MenuItem;
