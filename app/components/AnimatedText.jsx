import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const defaultAnimations = {
  hidden: { y: 50 },
  visible: { y: 0 },
  //visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

function AnimatedText({ text, className, once }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.8 });
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
        {text.split(" ").map((word) => (
          <span className="inline-block">
            {word.split("").map((char) => (
              <motion.span
                className="inline-block"
                variants={defaultAnimations}
              >
                {char}
              </motion.span>
            ))}
            <span className="inline-block">&nbsp;</span>
          </span>
        ))}
      </motion.span>
    </p>
  );
}

export default AnimatedText;
