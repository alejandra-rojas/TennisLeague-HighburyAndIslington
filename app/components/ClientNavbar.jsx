"use client";
import { motion } from "framer-motion";
import "../styles/Root.scss";
import localFont from "next/font/local";
import Link from "next/link";
import { Ball, BallOutline } from "./Icons";
import BallElement from "./BallElement";
import MenuBtnMobile from "./MenuBtnMobile";

const myFont = localFont({ src: "../../fonts/Humane-VF.ttf" });

export default function ClientNavbar() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5, ease: "easeIn" }}
    >
      <div id="client-mobile-navbar">
        <div className="header-item pt-12 pb-12 ">
          <h1 className={`text-4xl font-extrabold text-center`}>
            <Link href="/" aria-label="Go to the Home page">
              Highbury Doubles League
            </Link>
          </h1>

          <MenuBtnMobile />
        </div>
      </div>
      <div id="client-desktop-navigation">
        <div className="header-item">
          <nav role="navigation" aria-labelledby="primary-navigation">
            <h2 id="primary-site-navigation" className="sr-only">
              Home Site Navigation
            </h2>
            <ul>
              <li>
                <Link href={"/report-results"} aria-label="Go to the Home page">
                  About
                </Link>
              </li>
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
        </div>
        <div className="header-item">
          <Link href="/" aria-label="Go to the Home page">
            <h1 className={`text-4xl font-extrabold text-center`}>
              Highbury Doubles
            </h1>
          </Link>
        </div>
        <div className="header-item">
          <BallElement />
        </div>
      </div>
    </motion.div>
  );
}
