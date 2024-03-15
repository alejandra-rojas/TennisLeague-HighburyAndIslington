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

  if (isLoading) return <div>Loading leagues...</div>;
  if (isError) return <div>There was an error, try again. </div>;

  const today = new Date();

  // NEEDS TO BE TUNED IN
  // const unfinishedLeagues = data
  //   ?.filter((league) => !league.isfinished)
  //   .sort((a, b) => new Date(a.starting_date) - new Date(b.starting_date));

  //console.log(data);
  //Latest league only
  const league = data[data.length - 1];

  return (
    <>
      <section id="current-leagues">
        <section id="current-leagues-data">
          {/* <div>{JSON.stringify(data, null, 2)}</div>*/}
          <ul>
            {/* {latestLeague.map((league) => (
              <LeagueCardPublic key={league.id} {...league} />
            ))} */}
            <LeagueCardPublic key={league.id} {...league} />
          </ul>
        </section>
      </section>
    </>
  );
};

export default LatestResults;
