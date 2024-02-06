"use client";
import { motion as m } from "framer-motion";
import Link from "next/link";
import "../../styles/Public/ModalMenu.scss";

function MenuModal({ handleClose }) {
  return (
    <m.div
      key="menu-modal"
      className="menu-modal--wrapper"
      variants={backgroundAnimation}
      initial="closed"
      animate="open"
      exit="exit"
    >
      <div className="menu--modal">
        <m.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.25, duration: 0.45 }}
          onClick={handleClose}
        >
          close
        </m.button>
        <m.nav
          key="menu-body"
          className="menu--body"
          variants={navContainer}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          <div className="overflow-hidden">
            <m.a key="menu-item" variants={navItem}>
              Menu
            </m.a>
          </div>

          {menu.map((menuItem, index) => {
            return (
              <div
                key={index}
                className="modalMenu-link overflow-hidden"
                onClick={handleClose}
              >
                <Link href={`${menuItem.slug}`}>
                  <m.div key="menu-item" variants={navItem}>
                    {menuItem.title}
                  </m.div>
                </Link>
              </div>
            );
          })}
        </m.nav>
      </div>
    </m.div>
  );
}

export default MenuModal;

const backgroundAnimation = {
  open: {
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
  closed: {
    y: "-100%",
    transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    y: "100%",
    transition: {
      when: "afterChildren",
      delay: 2,
      duration: 0.55,
      ease: [0.55, 0, 1, 0.45],
    },
  },
};

export const navContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.5,
      staggerChildren: 0.3,
    },
  },
  exit: {
    transition: {
      when: "afterChildren",
      delayChildren: 0.1,
      staggerChildren: 0.1,
    },
  },
};

export const navItem = {
  hidden: { y: "100%" },
  show: { opacity: 1, y: "0%", transition: { duration: 0.3 } },
  exit: { y: "100%", opacity: 0 },
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
