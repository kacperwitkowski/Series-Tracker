import axios from "axios";
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import Head from "next/head";
import styles from "../styles/Stats.module.scss";
import Scroll from "../components/scroll";

const Rankings = () => {
  const [percentage, setPercentage] = useState("");
  const [watchTime, setWatchTime] = useState("");
  const [watchedCategory, setWatchedCategory] = useState("");
  const [starsRatings, setStarsRatings] = useState("");
  const [ranking, setRanking] = useState([]);
  const [avatar, setAvatar] = useState("");
  const counts = {};

  useEffect(() => {
    const fetchData = async () => {
      const getData = await axios.get(
        "https://api.themoviedb.org/3/trending/tv/week?api_key=a5257983ea0a933c036819e2e66c14e7"
      );

      setRanking(getData.data.results);
    };
    fetchData();
  }, []);

  useEffect(() => {
    //type fav genre

    const seriesFromLS = JSON.parse(localStorage.getItem("series") || "[]");

    const userGenres = seriesFromLS.map((el) => el.genres);
    const listOfGenres = [].concat.apply([], userGenres);
    const mostWatchedCategory = listOfGenres.reduce(
      (a, b, _, arr) =>
        arr.filter((v) => v === a).length >= arr.filter((v) => v === b).length
          ? a
          : b,
      null
    );

    setWatchedCategory(mostWatchedCategory);
  }, []);

  useEffect(() => {
    //calc ratings

    let starsRatings = JSON.parse(localStorage.getItem("stars") || "[]").filter(
      (el) => el.rating !== null
    );

    let starsValue = starsRatings
      .map((el) => el.rating)
      .reduce((a, b) => a + b, 0);

    const sumOfRatings = (starsValue / starsRatings.length).toFixed(1);

    setStarsRatings(sumOfRatings);
  }, []);

  useEffect(() => {
    const calcUserMinutes = async () => {
      //calc my minutes
      const snapshotUsers = await firebase
        .firestore()
        .collection("Users")
        .get();

      let listOfArrays = snapshotUsers.docs.map(
        (element) => element.data().data
      );

      let sumOfWatchTime = listOfArrays.map((item) =>
        item?.map((el) => el.minutes).reduce((a, b) => a + b, 0)
      );

      let seriesFromLS = JSON.parse(localStorage.getItem("series") || "[]");

      let myMinutes = seriesFromLS
        ?.map((el) => el.minutes)
        .reduce((a, b) => a + b, 0);

      let betterThanMe = sumOfWatchTime?.filter((el) => el > myMinutes);
      let calcedPercentage = (
        (betterThanMe?.length / sumOfWatchTime?.length) *
        100
      ).toFixed(1);

      setWatchTime(calcedPercentage);
    };
    calcUserMinutes();
  }, []);

  useEffect(() => {
    const calcAvatarPerc = async () => {
      //percentage of avatar
      const snapshotAvatar = await firebase
        .firestore()
        .collection("Avatars")
        .get();

      const sortedData = snapshotAvatar.docs.map((el) => el.data().data);

      const avatar = localStorage.getItem("avatar");
      setAvatar(avatar);

      const calcPercentage = (name) => {
        sortedData.forEach((x) => {
          counts[x] = (counts[x] || 0) + 1;
        });
        const valueOfObj = counts[name];

        const percentageOfAvatars = (
          (valueOfObj / sortedData?.length) *
          100
        ).toFixed(1);

        setPercentage(percentageOfAvatars ? percentageOfAvatars : 0);
      };
      calcPercentage(avatar);
    };
    calcAvatarPerc();
  }, []);

  return (
    <>
      <Head>
        <title>Series Tracker | Stats</title>
        <meta name="keywords" content="series tracker stats" />
      </Head>
      <div className={styles.stats}>
        <div>
          <div className={styles.stats__container}>
            <div className={styles.stats__container__div}>
              <p>
                Same avatar was selected by{" "}
                {isNaN(percentage) ? "0" : percentage}% users
              </p>
              <img
                src={avatar ? `/img/${avatar}` : "/img/av3.png"}
                alt="avatar"
              />
            </div>
            <div className={styles.stats__container__div}>
              <p>
                More minutes then you were viewed by{" "}
                {watchTime ? `${watchTime}` : "0"}% of users
              </p>
              <img src="/svg/tv.svg" alt="tv" />
            </div>
            <div className={styles.stats__container__div}>
              <p>
                The most watched category by you were "
                {watchedCategory ? watchedCategory : "None"}"
              </p>
              <img src="/svg/eyes.svg" alt="eyes" />
            </div>
            <div className={styles.stats__container__div}>
              <p>
                The average of your ratings is{" "}
                {isNaN(starsRatings) ? "0" : starsRatings}
              </p>
              <img src="/svg/goldenstar.svg" alt="star" />
            </div>
          </div>

          <div>
            <svg
              className={styles.waves}
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 24 150 28"
              preserveAspectRatio="none"
              shapeRendering="auto"
            >
              <defs>
                <path
                  id="gentle-wave"
                  d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                />
              </defs>
              <g className={styles.waves__parallax}>
                <use
                  xlinkHref="#gentle-wave"
                  x="48"
                  y="0"
                  fill="rgba(255,255,255,0.7"
                />
                <use
                  xlinkHref="#gentle-wave"
                  x="48"
                  y="3"
                  fill="rgba(255,255,255,0.5)"
                />
                <use
                  xlinkHref="#gentle-wave"
                  x="48"
                  y="5"
                  fill="rgba(255,255,255,0.3)"
                />
                <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
              </g>
            </svg>
          </div>
        </div>
        <div className={styles.waves__content}>
          <p>Trending</p>
        </div>
        <div className={styles.stats__trending}>
          {ranking
            ? ranking.map((el, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <p style={{ textAlign: "center" }}>{el.original_name}</p>
                  {i === 0 && (
                    <img
                      className={styles.stats__trending__medal}
                      src="/svg/goldmedal.svg"
                      alt="gold medal"
                    />
                  )}
                  {i === 1 && (
                    <img
                      className={styles.stats__trending__medal}
                      src="/svg/silvermedal.svg"
                      alt="silver medal"
                    />
                  )}
                  {i === 2 && (
                    <img
                      className={styles.stats__trending__medal}
                      src="/svg/bronzemedal.svg"
                      alt="bronze medal"
                    />
                  )}
                  {i !== 0 && i !== 1 && i !== 2 && (
                    <div className={styles.stats__trending__others}>
                      {i + 1}
                    </div>
                  )}
                  <img
                    style={{ position: "relative" }}
                    src={`https://image.tmdb.org/t/p/original/${el.poster_path}`}
                    alt={el.original_name}
                  />
                </div>
              ))
            : ""}
        </div>
      </div>
      <Scroll />
    </>
  );
};

export default Rankings;
