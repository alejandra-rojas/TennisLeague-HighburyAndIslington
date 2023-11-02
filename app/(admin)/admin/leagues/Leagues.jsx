"use client";
import { useQuery } from "react-query";
import axios from "axios";
import LeagueCard from "./LeagueCard";

const Leagues = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["leagues"],
    queryFn: async () => {
      const { data } = await axios.get("/api/leagues");
      console.log(data);

      return data.data;
    },
  });

  if (isLoading) return <div>Loading leagues...</div>;
  if (isError) return <div>There was an error, try again. </div>;

  //const unfinishedLeagues = leagues?.filter((league) => !league.isfinished);

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
      <div>{JSON.stringify(data, null, 2)}</div>;
    </>
  );
};

export default Leagues;
