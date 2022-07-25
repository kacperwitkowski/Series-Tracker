import Head from "next/dist/next-server/lib/head";
import { useEffect, useContext, useState } from "react";
import styles from "../../styles/ShowDetails.module.scss";
import Spinner from "../../components/spinner";
import AppContext from "../../components/context/Shows/showsContext";
import Episodes from "../../components/episodes";
import firebase from "firebase";
import { useUser } from "../../firebase/useUser";
import Scroll from "../../components/scroll";
import Stars from "../../components/stars";

const ShowDetails = (props) => {
  const { getShowPage, singleShow } = useContext(AppContext);
  const { user } = useUser();
  const stars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [rating, setRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(undefined);
  const [episodes, setEpisodes] = useState("");
  const [duplicate, setDuplicate] = useState(false);
  const [error, setError] = useState("");

  const color = {
    gray: "#d8d8d8",
    gold: "gold",
  };

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      let starsSr = JSON.parse(localStorage.getItem("stars") || "[]");
      let isMatched = starsSr.find((el) => el.id === props.data.id);
      isMatched ? setRating(isMatched.rating) : "";
    }

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      getShowPage(props.data.id);
      let series = JSON.parse(localStorage.getItem("series") || "[]");
      let duplicate = series.find((el) => el.id === singleShow?.id);

      if (duplicate) {
        setError("Can't add this series to your watched list");
        setDuplicate(true);
      }
    }
    return () => {
      isCancelled = true;
    };
  }, [singleShow.id]);

  useEffect(() => {
    const starsArray = JSON.parse(localStorage.getItem("stars") || "[]");

    if (!props.data.id || rating === 0) return;

    const element = starsArray.find((el) => el.id === props.data.id);

    if (element) {
      starsArray.push({ id: props.data.id, rating });
      const elToDelete = starsArray.indexOf(element);
      starsArray.splice(elToDelete, 1);

      localStorage.setItem("stars", JSON.stringify(starsArray));
      saveToFirebase("stars", "Ratings");
    } else {
      starsArray.push({ id: props.data.id, rating });
      localStorage.setItem("stars", JSON.stringify(starsArray));
      saveToFirebase("stars", "Ratings");
    }
  }, [rating]);

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      fetch(`https://api.tvmaze.com/shows/${props.data.id}/episodes`)
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
  }, [episodes]);

  const deleteRating = () => {
    const starsArray = JSON.parse(localStorage.getItem("stars") || "[]");

    const newStarsArray = starsArray.filter((el) => el.id !== props.data.id);
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
    let series = JSON.parse(localStorage.getItem("series") || "[]");
    let duplicate = series.find((el) => el.id === singleShow.id);

    if (duplicate) return;

    series.push({
      id: singleShow.id,
      name: singleShow.name,
      image: singleShow.image ? singleShow.image.medium : "/img/poster.jpg",
      minutes:
        episodes === "" || singleShow.averageRuntime === ""
          ? 0
          : episodes * singleShow.averageRuntime,
      rating: singleShow.rating ? singleShow.rating : "No data",
      genres: singleShow.genres ? singleShow.genres : "",
    });

    localStorage.setItem("series", JSON.stringify(series));

    saveToFirebase("series", "Users");
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
              {singleShow.genres &&
                singleShow.genres.map((el) => (
                  <span key={el} className={styles.showpage__genre}>
                    {el}
                  </span>
                ))}
            </div>
            <Episodes id={props.data.id} />
          </div>
        ) : (
          <Spinner />
        )}
        <Scroll />
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {
      data: context.params,
    },
  };
}

export default ShowDetails;
