import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const imageAnimation = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

function ImageHero({ data }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.25, once: true });

  return (
    <motion.div
      className="image-hero pointer-events-none"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeIn" }}
      viewport={{ once: true }}
    >
      {data && (
        <motion.img
          ref={ref}
          src={data.image.url}
          alt={data.image.alt}
          variants={imageAnimation}
          animate={isInView ? "visible" : "hidden"}
          viewport={{ once: false }}
        ></motion.img>
      )}
    </motion.div>
  );
}

export default ImageHero;
