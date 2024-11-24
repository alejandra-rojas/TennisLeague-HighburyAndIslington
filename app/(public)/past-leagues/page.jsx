import NextLeagueCallout from "../../components/public/NextLeagueCallout";
import LatestResults from "../../components/PublicData/LatestResults";

export default function PastLeagues() {
  return (
    <main id="results">
      <div className="header-container">
        <h2>RESULTS </h2>
      </div>
      <div className="latest-container" id="latest-results">
        <LatestResults />
      </div>
      <NextLeagueCallout />
    </main>
  );
}
