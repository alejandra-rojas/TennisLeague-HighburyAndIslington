"use client";
import "../styles/Public/styles.scss";
import { motion } from "framer-motion";
import { useLenis } from "@studio-freight/react-lenis";
import CourtHero from "../components/CourtHero";
import LatestResults from "../components/PublicData/LatestResults";

export default function Home() {
  //   const lenis = useLenis((scroll) => {
  //     console.log(scroll);
  //   });

  return (
    <main className="main-layout-client">
      <CourtHero />
      <motion.div
        className="image-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeIn" }}
      >
        <motion.img
          src="/1.png"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.45 }}
        ></motion.img>
      </motion.div>

      <div className="board">
        <motion.div
          className="main-text"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.45 }}
          viewport={{ once: true }}
        >
          The league is designed to give match practice for external LTA
          competitions and to build confidence generally for all competitive
          play.
        </motion.div>
      </div>

      <div className="latest-container">
        <div className="title">Latest results</div>
        <LatestResults />
      </div>
    </main>
  );
}
