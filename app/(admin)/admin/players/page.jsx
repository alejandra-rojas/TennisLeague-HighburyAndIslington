//Components
import { Suspense } from "react";
import CreatePlayer from "./CreatePlayer";
import NewPlayer from "./NewPlayer";
import PlayerList from "./PlayerList";
import Loading from "../loading";

export default function PlayersAdmin() {
  return (
    <main>
      <header>
        <div>
          <h2>Players Database</h2>
          <p>Manage your players database and access individual player pages</p>
        </div>
      </header>

      <CreatePlayer />

      <p>List of players</p>
      <Suspense fallback={<Loading />}>
        <PlayerList />
      </Suspense>
    </main>
  );
}

/* export default function PlayersAdmin() {
  /* const [todos, setTodos] = useState();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from("players").select();
      setTodos(data);
    };

    getData();
  }, []);
 
  return (
    <main>
      <header>
        <div>
          <h2>Players Database</h2>
          <p>Manage your players database and access individual player pages</p>
        </div>
      </header>
      <NewPlayer />
      <Suspense fallback={<Loading />}>
        <PlayerList />
      </Suspense>
         <div>
        {todos ? (
          <pre>{JSON.stringify(todos, null, 2)}</pre>
        ) : (
          <p>Loading todos...</p>
        )}
      </div> 
    </main>
  );
} */
