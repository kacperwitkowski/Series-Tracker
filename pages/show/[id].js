import Head from "next/dist/next-server/lib/head";
import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/ShowDetails.module.scss";
import Spinner from "../../components/spinner";
import AppContext from "../../components/context/Shows/showsContext";
import Episodes from "../../components/episodes";
import firebase from "firebase";
import { useUser } from "../../firebase/useUser";
import Scroll from "../../components/scroll";
import Stars from "../../components/stars";

const ShowDetails = () => {
  const {
    getShowPage,
    singleShow,
  } = useContext(AppContext);
  const router = useRouter();
  const { user } = useUser();
  const stars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(undefined);
  const [id, setID] = useState(null);
  const [episodes, setEpisodes] = useState("");

  const color = {
    gray: "#d8d8d8",
    gold: "gold",
  };

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      const routerID = router.query.id;
      getShowPage(routerID);
      setID(routerID);
    }
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      let starsSr = JSON.parse(localStorage.getItem("stars") || "[]");

      if (id === null && rating === 0) return;

      if (starsSr.find((el) => el.id === id)) {
        starsSr.push({ id, rating });
        let element = starsSr.find((el) => el.id === id);
        let elToDelete = starsSr.indexOf(element);
        starsSr.splice(elToDelete, 1);

        localStorage.setItem("stars", JSON.stringify(starsSr));
        firebase
          .firestore()
          .collection("Ratings")
          .doc(user.id)
          .set({ starsRatings: starsSr });
      } else {
        starsSr.push({ id, rating });
        localStorage.setItem("stars", JSON.stringify(starsSr));

        sendRating();
      }
    }

    return () => {
      isCancelled = true;
    };
  }, [rating]);

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      fetch(`https://api.tvmaze.com/shows/${router.query.id}/episodes`)
        .then((response) => response.json())
        .then((data) => {
          if (!isCancelled) {
            setEpisodes(data.length);
          }
        });
    }
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      let starsSr = JSON.parse(localStorage.getItem("stars") || "[]");
      let isMatched = starsSr.find((el) => el.id === id);
      isMatched ? setRating(isMatched.rating) : "";
    }

    return () => {
      isCancelled = true;
    };
  }, [episodes]);

  const sendRating = () => {
    if (user) {
      let starsRatings = JSON.parse(localStorage.getItem("stars") || "[]");
      try {
        firebase.firestore().collection("Ratings").doc(user.id).set({
          starsRatings,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const sendData = () => {
    if (user) {
      let data2 = JSON.parse(localStorage.getItem("series") || "[]");
      try {
        firebase.firestore().collection("Users").doc(user.id).set({
          data2,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const setLS = () => {
    let series = JSON.parse(localStorage.getItem("series") || "[]");
    let duplicate = series.find((el) => el.id === singleShow.id);

    if (duplicate) {
      alert("You've already watched this series!");
    } else {
      series.push({
        id: singleShow.id,
        name: singleShow.name,
        image: singleShow.image ? singleShow.image.medium : "/img/poster.jpg",
        minutes:
          episodes === "" || singleShow.averageRuntime === ""
            ? 0
            : episodes * singleShow.averageRuntime,
        rating: singleShow.rating ? singleShow.rating : "Brak danych",
        genres: singleShow.genres ? singleShow.genres : "",
      });
    }

    localStorage.setItem("series", JSON.stringify(series));
    // sendData2(series);
    sendData();
  };

  return (
    <>
      <Head>
        <title>Series Tracker | {singleShow ? singleShow.name : ""}</title>
        <meta
          name="keywords"
          content={singleShow ? singleShow.name + " series tracker" : ""}
        />
      </Head>
      <div className={styles.showpage}>
        {singleShow ? (
          <div>
            <div className={styles.showpage__container}>
              <div className={styles.showpage__image__name}>
                <img
                  src={
                    singleShow.image
                      ? singleShow.image.original
                      : "/img/poster.jpg"
                  }
                ></img>
              </div>

              <div className={styles.showpage__details}>
                <div className={styles.showpage__name}>
                  <div className={styles.showpage__name__span}>
                    <h1>{singleShow.name} </h1>
                    <span className={styles.showpage__score}>
                      {singleShow.rating?.average === null
                        ? "0"
                        : singleShow.rating?.average}
                    </span>
                  </div>
                  <button
                    className={styles.showpage__button}
                    onClick={() => setLS()}
                  >
                    <span>Add to watched</span>
                  </button>
                </div>
                <h3 className={styles.showpage__name__plot}>PLOT</h3>
                <p>
                  {singleShow.summary
                    ? singleShow.summary.replace(/(<([^>]+)>)/gi, "")
                    : "There is no summary"}
                </p>
                <a
                  href={`https://www.youtube.com/results?search_query=${singleShow.name}+series+trailer`}
                  target="_blank"
                >
                  Find the trailer on YT
                </a>
                <div className={styles.showpage__stars}>
                  <h2>Your rate:</h2>
                  <p className={styles.showpage__stars__rating}></p>
                  <div className={styles.showpage__stars__container}>
                    {stars.map((_, i) => (
                      <Stars
                        key={i}
                        color={
                          (hoverRating || rating) > i ? color.gold : color.gray
                        }
                        onMouseEnter={() => setHoverRating(i + 1)}
                        onMouseLeave={() => setHoverRating(undefined)}
                        onClick={() => {
                          setRating(i + 1);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.showpage__nav}>
              {singleShow.genres &&
                singleShow.genres.map((el) => (
                  <span key={el} className={styles.showpage__genre}>
                    {el}
                  </span>
                ))}
            </div>
            <Episodes id={router.query.id} />
          </div>
        ) : (
          <Spinner />
        )}
        <Scroll />
      </div>
    </>
  );
};

export default ShowDetails;
