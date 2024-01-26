import React from "react";
import { AnimatePresence, motion as m } from "framer-motion";

const menuItems = [
  { title: "About", slug: "past-leagues" },
  { title: "Rules", slug: "rules" },
  { title: "Past Results", slug: "past-leagues" },
];

const animation = {
  initial: { opacity: 0 },
  enter: (index) => ({ opacity: 1, transition: { delay: 0.5 + index * 0.5 } }),
  exit: { opacity: 0, duration: 0.75 },
};

function MobileModal({ handleClose }) {
  return (
    <div className="modal-wrapper">
      <m.button
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.25, duration: 0.45 }}
        onClick={handleClose}
      >
        close
      </m.button>
      <div className="navigation ">
        {menuItems.map((menuItem, index) => (
          <m.div
            variants={animation}
            animate="enter"
            exit="exit"
            initial="initial"
            custom={index}
            key={index}
            className="menu-item"
          >
            <a href={menuItem.slug}>{menuItem.title}</a>
          </m.div>
        ))}
      </div>
    </div>
  );
}

export default MobileModal;
