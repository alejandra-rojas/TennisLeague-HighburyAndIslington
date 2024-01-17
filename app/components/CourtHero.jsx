import React from "react";
import "../styles/Public/court.scss";
import { motion } from "framer-motion";
import { useLenis } from "@studio-freight/react-lenis";

function CourtHero() {
  const lenis = useLenis((scroll) => {
    //console.log(scroll);
  });

  return (
    <motion.div
      className="court"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeIn" }}
    >
      <div className="details ">
        <div className="text-container">
          <motion.div
            className="title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: "easeIn" }}
          >
            Highbury Tennis Club runs a thriving doubles league for its women
            members
          </motion.div>
          <motion.div
            className="subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            There are two club leagues a year with four divisions spanning all
            abilities.
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="buttons-container"
          >
            <div className="button accent">Find out more</div>
            <button
              className="button"
              onClick={() => lenis.scrollTo("#latest-results", { lerp: 0.04 })}
            >
              Latest results
            </button>
          </motion.div>
        </div>
      </div>
      <div className="line div1"> </div>
      <div className="line div2"> </div>
      <div className="line div3"> </div>
      <div className="line div4"> </div>
      <div className="line div5"> </div>
      <div className="line div6"> </div>
      <div className="line div7"> </div>
      <div className="line div8"> </div>
      <div className="line div9"> </div>
      <div className="line div10"> </div>
    </motion.div>
  );
}

export default CourtHero;
