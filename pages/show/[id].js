import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../../styles/ShowDetails.module.scss";
import Spinner from "../../components/spinner";
import Episodes from "../../components/episodes";
import firebase from "firebase";
import { useUser } from "../../firebase/useUser";
import Scroll from "../../components/scroll";
import Stars from "../../components/stars";
import axios from "axios";
import Image from "next/image";

const ShowDetails = ({ show }) => {
  const { user } = useUser();
  const stars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [rating, setRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(undefined);
  const [duplicate, setDuplicate] = useState(false);
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [error, setError] = useState("");

  const color = {
    gray: "#d8d8d8",
    gold: "gold",
  };

  //slow version
  // useEffect(() => {
  //   const getData = async () => {
  //     const [seasonsRes, episodesRes] = await Promise.all([
  //       fetch(`https://api.tvmaze.com/shows/${show.id}/seasons`),
  //       fetch(`https://api.tvmaze.com/shows/${show.id}/episodes`),
  //     ]);
  //     const [seasons, episodes] = await Promise.all([
  //       seasonsRes.json(),
  //       episodesRes.json(),
  //     ]);

  //     setSeasons(seasons);
  //     setEpisodes(episodes);
  //   };
  //   getData();
  // }, [show]);

  useEffect(() => {
    const getData = async () => {
      console.log(show);
      const getSeasons = await axios.get(
        `https://api.tvmaze.com/shows/${show.id}/seasons`
      );

      const getEpisodes = await axios.get(
        `https://api.tvmaze.com/shows/${show.id}/episodes`
      );

      setSeasons(getSeasons.data);
      setEpisodes(getEpisodes.data);
    };
    getData();
  }, []);

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      let starsSr = JSON.parse(localStorage.getItem("stars") || "[]");
      let isMatched = starsSr.find((el) => el.id === show.id);
      isMatched ? setRating(isMatched.rating) : "";
    }

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      let series = JSON.parse(localStorage.getItem("series") || "[]");
      let duplicate = series.find((el) => el.id === show.id);

      if (duplicate) {
        setError("Can't add this series to your watched list");
        setDuplicate(true);
      } else {
        setDuplicate(false);
      }
    }
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    const starsArray = JSON.parse(localStorage.getItem("stars") || "[]");

    if (!show.id || rating === 0) return;

    const element = starsArray.find((el) => el.id === show.id);

    if (element) {
      starsArray.push({ id: show.id, rating });
      const elToDelete = starsArray.indexOf(element);
      starsArray.splice(elToDelete, 1);

      localStorage.setItem("stars", JSON.stringify(starsArray));
      saveToFirebase("stars", "Ratings");
    } else {
      starsArray.push({ id: show.id, rating });
      localStorage.setItem("stars", JSON.stringify(starsArray));
      saveToFirebase("stars", "Ratings");
    }
  }, [rating]);

  const deleteRating = () => {
    const starsArray = JSON.parse(localStorage.getItem("stars") || "[]");

    const newStarsArray = starsArray.filter((el) => el.id !== show.id);
    setRating(0);
    localStorage.setItem("stars", JSON.stringify(newStarsArray));
    saveToFirebase("stars", "Ratings");
  };

  const saveToFirebase = (type, collection) => {
    if (user) {
      let data = JSON.parse(localStorage.getItem(type) || "[]");
      try {
        firebase.firestore().collection(collection).doc(user.id).set({
          data,
        });
      } catch (error) {
        setError("Can't save data to firebase");
      }
    }
  };

  const handleSaveData = () => {
    setDuplicate(true);
    let series = JSON.parse(localStorage.getItem("series") || "[]");
    let duplicate = series.find((el) => el.id === show.id);

    if (duplicate) return;

    series.push({
      id: show.id,
      name: show.name,
      image: show?.image ? show.image.original : "/img/poster.jpg",
      minutes:
        show.averageRuntime === "" ? 0 : episodes.length * show.averageRuntime,
      rating: show.rating ? show.rating : "No show",
      genres: show.genres ? show.genres : "",
    });

    localStorage.setItem("series", JSON.stringify(series));

    saveToFirebase("series", "Users");
  };

  return (
    <>
      <Head>
        <title>Series Tracker | {show ? show.name : ""}</title>
        <meta
          name="keywords"
          content={show ? show.name + " series tracker" : ""}
        />
      </Head>
      <div className={styles.showpage}>
        {show ? (
          <div>
            <div className={styles.showpage__container}>
              <div className={styles.showpage__image__name}>
                {console.log(show)}
                <img
                  alt="poster"
                  src={show.image ? show.image.original : "/img/poster.jpg"}
                />
                {/* <Image
                  src={show.image ? show.image.original : "/img/poster.jpg"}
                  alt="gownosofar"
                  priority={true}
                  layout="fill"
                  className={styles.showpage__imagee}
                /> */}
              </div>

              <div className={styles.showpage__details}>
                <div className={styles.showpage__name}>
                  <div className={styles.showpage__name__span}>
                    <h1>{show.name} </h1>
                    <span className={styles.showpage__score}>
                      {show.rating?.average === null
                        ? "0"
                        : show.rating?.average}
                    </span>
                  </div>
                  <button
                    disabled={duplicate ? true : false}
                    className={
                      duplicate
                        ? styles.showpage__button__duplicate
                        : styles.showpage__button
                    }
                    onClick={() => handleSaveData()}
                  >
                    <span>{duplicate ? "Watched" : "Add to watched"}</span>
                  </button>
                </div>
                <h3 className={styles.showpage__name__plot}>PLOT</h3>
                <p>
                  {show.summary
                    ? show.summary.replace(/(<([^>]+)>)/gi, "")
                    : "There is no summary"}
                </p>
                <a
                  href={`https://www.youtube.com/results?search_query=${show.name}+series+trailer`}
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
                    {rating >= 1 && (
                      <button
                        className={styles.showpage__stars__container__button}
                        onClick={deleteRating}
                      >
                        X
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.showpage__nav}>
              {show.genres &&
                show.genres.map((el) => (
                  <span key={el} className={styles.showpage__genre}>
                    {el}
                  </span>
                ))}
            </div>
            <Episodes seasons={seasons} episodes={episodes} />
          </div>
        ) : (
          <Spinner />
        )}
        <Scroll />
      </div>
    </>
  );
};

export async function getStaticPaths() {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
}

export async function getStaticProps({ params }) {
  const id = (parseInt(params.id) || 1).toString();

  const res = await fetch(`https://api.tvmaze.com/shows/${id}`);
  const show = await res.json();
  return { props: { show } };
}

// export async function getServerSideProps(context) {
//   const [seasonsRes, episodesRes] = await Promise.all([
//     fetch(`https://api.tvmaze.com/shows/${context.query.id}/seasons`),
//     fetch(`https://api.tvmaze.com/shows/${context.query.id}/episodes`),
//   ]);
//   const [seasons, episodes] = await Promise.all([
//     seasonsRes.json(),
//     episodesRes.json(),
//   ]);
//   return { props: { seasons, episodes } };
// }

export default ShowDetails;
