"use client";
import "../styles/Public/styles.scss";
import { useEffect, useState, useRef, Suspense } from "react";

import { motion, useInView } from "framer-motion";
import CourtHero from "../components/CourtHero";
import ImageHero from "../components/ImageHero";
import LatestResults from "../components/PublicData/LatestResults";
import NextLeagueCallout from "../components/NextLeagueCallout";
import { getHomepage } from "../../sanity/sanity-queries";
import AnimatedText from "../components/AnimatedText";

export default function Home() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.65, once: true });

  useEffect(() => {
    const fetchData = async () => {
      const homepageData = await getHomepage();
      setData(homepageData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <main className="main-layout-client">
      <CourtHero data={data} />
      {isLoading ? <div></div> : <ImageHero data={data} />}

      <div className="board">
        <motion.div
          className="main-text"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.45 }}
          viewport={{ once: false }}
        >
          {data.callout}
        </motion.div>
      </div>

      <div className="latest-container" id="latest-results">
        <div className="relative">
          <div>
            <AnimatedText text="Latest Results" className="title" />
          </div>
          {/* <motion.div
            variants={{
              hidden: { left: 0 },
              visible: { left: "100%" },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: 1, ease: "easeIn" }}
            style={{
              position: "absolute",
              top: 6,
              bottom: 0,
              left: 0,
              right: 0,
              background: "#0f2d32",
              zIndex: 20,
            }}
          ></motion.div> */}
        </div>
        <LatestResults />
      </div>
      <NextLeagueCallout />
    </main>
  );
}
