import Head from "next/dist/next-server/lib/head";
import { useState, useContext } from "react";
import Alert from "../components/alert";
import AlertsContext from "../components/context/Alerts/alertsContext";
import AppContext from "../components/context/Shows/showsContext";
import ListShowsView from "../components/listShowsView";
import Spinner from "../components/spinner";
import styles from "../styles/Home.module.scss";
import { useUser } from "../firebase/useUser";

export default function Home() {
  const [searched, setSearched] = useState("");
  const { shows, searchShows, loading } = useContext(AppContext);
  const { user } = useUser();

  const { alert, setAlert } = useContext(AlertsContext);

  const colors = ["black", "darkslateblue", "darkred"];
  const [defaultColor, setDefaultColor] = useState("black");

  const searchHandler = (e) => {
    e.preventDefault();
    if (searched === "") {
      setAlert("Please enter something", "danger");
    } else {
      searchShows(searched);
    }
  };

  return (
    <>
      <Head>
        <title>Series Tracker</title>
        <meta name="keywords" content="series tracker" />
      </Head>
      <div className={styles.homepage}>
        {alert ? <Alert msg="Please enter something" type={alert.type} /> : ""}
        <form className={styles.searchbar}>
          <input
            type="text"
            className={styles.searchbar__input}
            placeholder="Type in show.."
            value={searched}
            onChange={(e) => setSearched(e.target.value)}
          />
          <button className={styles.searchbar__btn} onClick={searchHandler}>
            &#x1F50E;
          </button>
        </form>
        {loading ? (
          <Spinner />
        ) : (
          <div className={styles.homepage__list}>
            {shows.length !== 0 ? (
              shows.map((el) => (
                <ListShowsView
                  whole={el}
                  key={el.show.id}
                  id={el.show.id}
                  image={
                    el.show.image ? el.show.image.medium : "/img/poster.jpg"
                  }
                  name={el.show.name}
                  rating={
                    el.show.rating.average
                      ? el.show.rating.average
                      : "No rating"
                  }
                />
              ))
            ) : (
              <div className={styles.homepage__blank}>
                <div className={styles.homepage__blank__modal}>
                  {user ? (
                    <p
                      className={styles.homepage__welcome}
                      style={{ color: defaultColor }}
                    >
                      Happy to see you're logged in! Now feel free to browse
                      your favourite series and shows!
                    </p>
                  ) : (
                    <p
                      className={styles.homepage__welcome}
                      style={{ color: defaultColor }}
                    >
                      Welcome on Series Tracker where you can browse your
                      favourite TV shows and series, rate them or even calculate
                      your full watchtime. In order to use all of features log
                      in or create your account and you're not going to regret
                      it!
                    </p>
                  )}
                </div>
                <div className={styles.homepage__paint}>
                  <p>Change spray color:</p>
                  <ul>
                    {colors.map((el) => (
                      <button
                        key={el}
                        onClick={() => setDefaultColor(el)}
                        style={{ backgroundColor: `${el}` }}
                      ></button>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
