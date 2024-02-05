"use client";
import "../styles/Public/styles.scss";
import { getHomepage } from "../../sanity/sanity-queries";
import { useEffect, useState, useRef, Suspense } from "react";
import { motion } from "framer-motion";
import CourtHero from "../components/CourtHero";
import ImageHero from "../components/ImageHero";
import LatestResults from "../components/PublicData/LatestResults";
import NextLeagueCallout from "../components/public/NextLeagueCallout";
import AnimatedText from "../components/AnimatedText";

export default function Home() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
          viewport={{ once: true }}
        >
          {data.callout}
        </motion.div>
      </div>

      <div className="latest-container" id="latest-results">
        <div className="relative">
          <div>
            <AnimatedText text="Latest Results" className="title" />
          </div>
        </div>
        <LatestResults />
      </div>
      <NextLeagueCallout />
    </main>
  );
}
