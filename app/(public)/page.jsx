"use client";
import "../styles/Public/styles.scss";
import { getHomepage } from "../../sanity/sanity-queries";
import { useEffect, useState, useRef, Suspense } from "react";
import { motion } from "framer-motion";
import CourtHero from "../components/public/CourtHero";
import ImageHero from "../components/public/ImageHero";
import TextCallout from "../components/public/TextCallout";
import LatestResults from "../components/PublicData/LatestResults";
import NextLeagueCallout from "../components/public/NextLeagueCallout";
import AnimatedText from "../components/public/AnimatedText";

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

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="main-layout-client">
      <CourtHero data={data} />

      <ImageHero data={data} />

      <TextCallout data={data} />

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
