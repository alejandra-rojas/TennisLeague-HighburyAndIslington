"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const defaultAnimations = {
  hidden: { y: 100 },
  visible: { y: 0 },
  //visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

function AnimatedText({ text, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 1, once: true });
  return (
    <p className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ staggerChildren: 0.07 }}
        aria-hidden
      >
        {text.split(" ").map((word, index, array) => (
          <span key={index} className="overflow-hidden inline-block">
            {word.split("").map((char, index) => (
              <motion.span
                key={index}
                className="inline-block"
                variants={defaultAnimations}
              >
                {char}
              </motion.span>
            ))}
            {index !== array.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
      </motion.span>
    </p>
  );
}

export default AnimatedText;
