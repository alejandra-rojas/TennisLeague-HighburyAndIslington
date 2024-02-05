import { motion } from "framer-motion";
import Link from "next/link";

const mountAnim = { initial: "initial", animate: "enter", exit: "exit" };

const rotateX = {
  initial: {
    y: 100,
  },
  enter: (i) => ({
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1],
      delay: 1.5 + i * 0.05,
    },
  }),
  exit: {
    opacity: 0,
    transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
  },
};

function MenuItem({ data, index, handleClose }) {
  const { title, slug, description, images } = data;

  return (
    <motion.div
      variants={rotateX}
      {...mountAnim}
      custom={index}
      className="modalMenu-link"
      onClick={handleClose}
    >
      <Link href={slug}>
        <span className="inline-block">{title}</span>
      </Link>
    </motion.div>
  );
}

export default MenuItem;

// REVEAL ANIMATION

/*        <m.div
            variants={animation}
            animate="enter"
            exit="exit"
            initial="initial"
            custom={index}
            key={index}
            className="menu__item"
          >
            <Link
              href={menuItem.slug}
              onClick={handleClose}
              aria-label={`Go to the ${menuItem.title} page`}
              className="menu__item-link"
            >
              {menuItem.title}
            </Link>
          </m.div> */
