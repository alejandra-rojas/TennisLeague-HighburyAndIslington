"use client";
import { motion } from "framer-motion";
import "../../styles/Root.scss";
import localFont from "next/font/local";
import Link from "next/link";
import BallElement from "./BallElement";
import MenuBtnMobile from "../MenuBtnMobile";

const myFont = localFont({ src: "../../../fonts/Humane-VF.ttf" });

export default function ClientNavbar() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5, ease: "easeIn" }}
      viewport={{ once: true }}
    >
      <div id="client-navbar">
        <div className="navbar-wrapper pt-12 pb-12 ">
          <nav
            className="navbar"
            role="navigation"
            aria-labelledby="primary-navigation"
          >
            <h2 id="primary-site-navigation" className="sr-only">
              Home Site Navigation
            </h2>
            <ul>
              <li>
                <Link href={"/rules"} aria-label="Go to About page">
                  Rules
                </Link>
              </li>
              <li>
                <Link href={"/past-leagues"} aria-label="Go to Admin page">
                  Past Results
                </Link>
              </li>
            </ul>
          </nav>
          <h1 className={`H1 font-extrabold text-center`}>
            <Link href="/" aria-label="Go to the Home page">
              Highbury Doubles Leagues
            </Link>
          </h1>

          <MenuBtnMobile />
        </div>
      </div>
    </motion.div>
  );
}
