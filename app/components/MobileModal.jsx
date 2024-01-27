import { useEffect, useRef } from "react";
import { AnimatePresence, motion as m } from "framer-motion";
import Link from "next/link";

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
    <div className="modal-wrapper">
      <m.button
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.25, duration: 0.45 }}
        onClick={handleClose}
      >
        close
      </m.button>
      <nav className="menu">
        {menu.map((menuItem, index) => (
          <m.div
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
            <div class="marquee">
              <div class="marquee__inner-wrap">
                <div class="marquee__inner" aria-hidden="true">
                  <span>1</span>
                  <div
                    class="marquee__img"
                    style={{ backgroundImage: `url('/1.png')` }}
                  ></div>
                  <span>2</span>
                  <div
                    class="marquee__img"
                    style={{ backgroundImage: `url('/1.png')` }}
                  ></div>
                  <span>3</span>
                  <div
                    class="marquee__img"
                    style={{ backgroundImage: `url('/1.png')` }}
                  ></div>
                  <span>4</span>
                  <div
                    class="marquee__img"
                    style={{ backgroundImage: `url('/1.png')` }}
                  ></div>
                  <span>1</span>
                  <div
                    class="marquee__img"
                    style={{ backgroundImage: `url('/1.png')` }}
                  ></div>
                  <span>2</span>
                  <div
                    class="marquee__img"
                    style={{ backgroundImage: `url('/1.png')` }}
                  ></div>
                  <span>3</span>
                  <div
                    class="marquee__img"
                    style={{ backgroundImage: `url('/1.png')` }}
                  ></div>
                  <span>4</span>
                  <div
                    class="marquee__img"
                    style={{ backgroundImage: `url('/1.png')` }}
                  ></div>
                </div>
              </div>
            </div>
          </m.div>
        ))}
      </nav>
    </div>
  );
}

export default MobileModal;
