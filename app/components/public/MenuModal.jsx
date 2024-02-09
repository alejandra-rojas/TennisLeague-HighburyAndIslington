"use client";
import { motion as m } from "framer-motion";
import Link from "next/link";
import "../../styles/Public/ModalMenu.scss";
import { Barlow_Semi_Condensed } from "next/font/google";
import { X } from "../Icons";

const barlow = Barlow_Semi_Condensed({
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "700", "900"],
  variable: "--font-barlow",
});

function MenuModal({ handleClose }) {
  return (
    <>
      <m.div
        key="colored-background"
        className="third-layer__darkcolor"
        variants={thirdLayer}
        initial="closed"
        animate="open"
        exit="exit"
      ></m.div>

      <m.div
        key="colored-background-two"
        className="second-layer__lightcolor"
        variants={secondLayer}
        initial="closed"
        animate="open"
        exit="exit"
      ></m.div>

      <m.div
        key="colored-background-two"
        className="first-layer__background"
        variants={firstLayer}
        initial="closed"
        animate="open"
        exit="exit"
      ></m.div>

      <div key="menu-modal" className="menu-modal--wrapper">
        <div className={`menu--modal ${barlow.variable}`}>
          <m.button
            className="close--modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 1.25,
              duration: 0.45,
            }}
            onClick={handleClose}
          >
            <span>close</span>
          </m.button>
          <m.nav
            key="menu-body"
            className="menu--body"
            variants={navContainer}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <div key="menu-item-0" className="modalMenu-link overflow-hidden">
              <m.a variants={navItem}>Menu</m.a>
            </div>

            {menu.map((menuItem, index) => {
              return (
                <div
                  key={index}
                  className="modalMenu-link overflow-hidden"
                  onClick={handleClose}
                >
                  <Link href={`${menuItem.slug}`}>
                    <m.div variants={navItem}>{menuItem.title}</m.div>
                  </Link>
                </div>
              );
            })}
          </m.nav>
        </div>
        <m.div
          className="line"
          variants={line}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          <div key={"serve-line"} className="overflow-hidden">
            <m.div variants={serveLine} className="serve-line"></m.div>
          </div>
        </m.div>
      </div>
    </>
  );
}

export default MenuModal;

const thirdLayer = {
  open: {
    y: 0,
    transition: { duration: 1, ease: [0.12, 0, 0.39, 0] },
  },
  closed: {
    y: "-100%",
    transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    y: "-100%",
    transition: {
      delay: 1,
      duration: 0.55,
      ease: [0.55, 0, 1, 0.45],
    },
  },
};

const secondLayer = {
  open: {
    y: 0,
    transition: {
      duration: 0.95,
      delay: 0.15,
      ease: [0.32, 0, 0.67, 0],
    },
  },
  closed: {
    y: "-100%",
    transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    y: "-100%",
    transition: {
      delay: 0.75,
      duration: 0.55,
      ease: [0.55, 0, 1, 0.45],
    },
  },
};

const firstLayer = {
  open: {
    y: 0,
    transition: { duration: 0.6, delay: 1.3, ease: [0.3, 0, 0.75, 0] },
  },
  closed: {
    y: "-100%",
    transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    y: "-100%",
    transition: {
      delay: 0.55,
      duration: 0.4,
      ease: [0.55, 0, 1, 0.45],
    },
  },
};

export const navContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      delayChildren: 1.2,
      staggerChildren: 0.2,
      staggerDirection: 1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren",
      delayChildren: 0.1,
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
};

export const navItem = {
  hidden: { y: "100%" },
  show: {
    y: "0%",
    transition: {
      ease: [0.3, 0, 0.75, 0],
    },
  },
  exit: { y: "100%" },
};

export const line = {
  hidden: { y: "-100%" },
  show: {
    y: "0%",
    transition: {
      delay: 1.7,
      duration: 0.35,
      ease: [0.37, 0, 0.63, 1],
      when: "beforeChildren",
      delayChildren: 0,
    },
  },
  exit: {
    y: "-100%",
    transition: {
      when: "afterChildren",
      ease: [0.37, 0, 0.63, 1],
    },
  },
};
export const serveLine = {
  hidden: { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" },
  show: {
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
    transition: {
      duration: 0.3,
      ease: [0.37, 0, 0.63, 1],
    },
  },
  exit: { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" },
};

const menu = [
  {
    title: "Homepage",
    slug: "/",
    description: "Back to ",
  },

  {
    title: "Rules",
    slug: "rules",
    description: "Rules ",
    images: ["contact1.jpg", "contact2.jpg"],
  },
  {
    title: "Results",
    slug: "past-leagues",
    description: "Previous ",
  },
];
