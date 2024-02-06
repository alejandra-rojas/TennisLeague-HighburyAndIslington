import "../styles/Public/styles.scss";
import { getHomepage } from "../../sanity/sanity-queries";
import CourtHero from "../components/public/CourtHero";
import ImageHero from "../components/public/ImageHero";
import TextCallout from "../components/public/TextCallout";
import LatestResults from "../components/PublicData/LatestResults";
import NextLeagueCallout from "../components/public/NextLeagueCallout";
import AnimatedText from "../components/public/AnimatedText";

export default async function Home() {
  const homepageData = await getHomepage();

  return (
    <main className="main-layout-client">
      <CourtHero data={homepageData} />

      <ImageHero data={homepageData} />

      <TextCallout data={homepageData} />

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
