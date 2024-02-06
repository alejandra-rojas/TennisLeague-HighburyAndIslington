"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const animation = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function TextCallout({ data }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.4, once: true });

  return (
    <motion.div
      ref={ref}
      className="main-text"
      variants={animation}
      animate={isInView ? "visible" : "hidden"}
    >
      {data.callout}
    </motion.div>
  );
}

export default TextCallout;
