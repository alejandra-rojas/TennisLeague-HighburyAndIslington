"use client";
import { useQuery } from "react-query";
import axios from "axios";
//import LeagueCard from "../../(admin)/admin/leagues/LeagueCard";
import LeagueCardPublic from "./LeagueCardPublic";
import "../../styles/Public/LeagueCardPublic.scss";

const LatestResults = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["leagues"],
    queryFn: async () => {
      const { data } = await axios.get("/api/leagues");
      return data.data;
    },
  });

  const today = new Date();

  // Filter leagues based on active criteria
  const activeLeagues = data?.filter((league) => {
    const startDate = new Date(`${league.starting_date}T00:00:00Z`);
    const endDate = new Date(`${league.end_date}T00:00:00Z`);

    // Calculate the active range
    const activeStartDate = new Date(startDate);
    activeStartDate.setDate(activeStartDate.getDate() - 1); // 1 day before start

    const activeEndDate = new Date(endDate);
    activeEndDate.setDate(activeEndDate.getDate() + 30); // 30 days after end

    // Check if today is within the active range
    return today >= activeStartDate && today <= activeEndDate;
  });

  // Sort active leagues by starting_date
  const sortedActiveLeagues = activeLeagues?.sort(
    (a, b) =>
      new Date(`${a.starting_date}T00:00:00Z`) -
      new Date(`${b.starting_date}T00:00:00Z`)
  );

  return (
    <>
      <section id="current-leagues">
        <section id="current-leagues-data">
          <ul>
            {sortedActiveLeagues?.map((league) => (
              <LeagueCardPublic key={league.id} {...league} />
            ))}
          </ul>
          {sortedActiveLeagues?.length === 0 && (
            <div>No active leagues currently.</div>
          )}
        </section>
      </section>
    </>
  );
};

export default LatestResults;
