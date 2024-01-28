import { useEffect, useRef } from "react";
import { AnimatePresence, motion as m } from "framer-motion";
import Link from "next/link";
import MenuItem from "../components/MenuItem";
import "../styles/Public/ModalMenu.scss";
import Image from "next/image";

const menu = [
  {
    title: "Homepage",
    slug: "/",
    description: "Back to the beginning",
    images: ["contact1.jpg", "contact2.jpg"],
  },
  {
    title: "About",
    slug: "past-leagues",
    description: "More about the league",
    images: ["contact1.jpg", "contact2.jpg"],
  },
  {
    title: "Rules",
    slug: "rules",
    description: "The rules of the game",
    images: ["contact1.jpg", "contact2.jpg"],
  },
  {
    title: "Results",
    slug: "past-leagues",
    description: "Previous results",
    images: ["contact1.jpg", "contact2.jpg"],
  },
];

const animation = {
  initial: { opacity: 0 },
  enter: (index) => ({ opacity: 1, transition: { delay: 0.5 + index * 0.5 } }),
  exit: { opacity: 0, duration: 0.75 },
};

function MobileModal({ handleClose }) {
  return (
    <div className="menu">
      <m.button
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.25, duration: 0.45 }}
        onClick={handleClose}
      >
        close
      </m.button>
      <nav className="menu--body">
        {menu.map((menuItem, index) => {
          return <MenuItem data={menuItem} index={index} key={index} />;
        })}
      </nav>
    </div>
  );
}

export default MobileModal;
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
