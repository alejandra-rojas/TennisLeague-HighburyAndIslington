import { AnimatePresence, motion as m } from "framer-motion";
import Link from "next/link";
import "../styles/Public/ModalMenu.scss";

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

export const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.5,
      staggerChildren: 0.3,
    },
  },
};

export const item = {
  hidden: { y: "100%" },
  show: { y: "0%", transition: { duration: 0.3 } },
};

function MobileModal({ handleClose }) {
  return (
    <div className="menu">
      <m.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.25, duration: 0.45 }}
        onClick={handleClose}
      >
        close
      </m.button>
      <m.nav
        className="menu--body"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="overflow-hidden">
          <m.a variants={item}>Menu</m.a>
        </div>

        {menu.map((menuItem, index) => {
          return (
            <div
              key={index}
              className="modalMenu-link overflow-hidden"
              onClick={handleClose}
            >
              <Link href={`${menuItem.slug}`}>
                <m.div variants={item}>{menuItem.title}</m.div>
              </Link>
            </div>
          );
        })}
      </m.nav>
    </div>
  );
}

export default MobileModal;
