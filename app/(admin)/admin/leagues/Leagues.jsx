"use client";
import { useQuery } from "react-query";
import axios from "axios";
import LeagueCard from "./LeagueCard";

const Leagues = () => {
  //GETTING LEAGUES DATA
  const { data, isLoading, isError } = useQuery({
    queryKey: ["leagues"],
    queryFn: async () => {
      const { data } = await axios.get("/api/leagues");
      //console.log(data);
      const reversedArray = data.data.reverse();

      return reversedArray;
    },
  });

  if (isLoading) return <div>Loading leagues...</div>;
  if (isError) return <div>There was an error, try again. </div>;

  const today = new Date();
  const unfinishedLeagues = data
    ?.filter((league) => !league.isfinished)
    .sort((a, b) => new Date(a.starting_date) - new Date(b.starting_date));

  return (
    <>
      <section id="current-leagues">
        <header id="league-section-header" className="sr-only">
          <h2>Ongoing and Future Leagues</h2>
          <p>
            Leagues that are not finished and todays date is within the range of
            the start and end date
          </p>
        </header>

        <section id="current-leagues-data">
          {/* <div>{JSON.stringify(data, null, 2)}</div>*/}
          <ul>
            {data.map((league) => (
              <LeagueCard key={league.id} {...league} />
            ))}
          </ul>
        </section>
      </section>
    </>
  );
};

export default Leagues;
