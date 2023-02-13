import firebase from "firebase/app";
import "firebase/firestore";
import { useState, useEffect } from "react";
import { useUser } from "../../firebase/useUser";
import Link from "next/dist/client/link";
import styles from "../../styles/SeriesDash.module.scss";

const ReadDataFromCloudFirestore = () => {
  const { user } = useUser();
  const [database, setDatabase] = useState([]);
  const [arrLength, setArrLength] = useState("");
  const [refreshState, setRefreshState] = useState(false);

  useEffect(() => {
    if (user) {
      firebase
        .firestore()
        .collection("Ratings")
        .doc(user.id)
        .get()
        .then((snapshot2) => {
          let rate = snapshot2.data();
          if (rate === undefined) {
            localStorage.setItem("stars", "[]");
          } else {
            localStorage.setItem("stars", JSON.stringify(rate.data));
          }
        });
    }
  }, [refreshState]);

  const deleteWatched = (ID) => {
    const newData = database.filter((el) => {
      return el.id !== ID;
    });
    setDatabase(newData);

    localStorage.setItem("series", JSON.stringify(newData));

    firebase
      .firestore()
      .collection("Users")
      .doc(user.id)
      .set({ data: newData });

    setArrLength(newData.length);
  };

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      if (user) {
        firebase
          .firestore()
          .collection("Users")
          .doc(user.id)
          .get()
          .then((snapshot) => {
            let firebaseData = snapshot.data();
            setDatabase(firebaseData?.data);
            setArrLength(firebaseData?.data?.length);
            if (firebaseData === undefined) {
              localStorage.setItem("series", "[]");
            } else {
              localStorage.setItem(
                "series",
                JSON.stringify(firebaseData?.data)
              );
            }
          });
      }
    }

    return () => {
      isCancelled = true;
    };
  }, [refreshState]);

  useEffect(() => {
    setRefreshState(!refreshState);
  }, []);

  let time = database
    ? database
        .map((mn) => mn.minutes)
        .reduce((sum, current) => sum + current, 0)
    : "";

  const time_convert = (num) => {
    let hours = Math.floor(num / 60);
    let days = Math.floor(hours / 24);
    let hoursRemainder = hours % 24;

    return (
      <>
        <h2>
          Your watch time is almost: {days} days and {hoursRemainder} hours
        </h2>
      </>
    );
  };
  return (
    <div className={styles.series__wrapper}>
      <div className={styles.series__time__count}>{time_convert(time)}</div>
      <p></p>
      <div className={styles.series}>
        {database
          ? database.map((el) => (
              <div className={styles.series__content} key={el.id}>
                <div className={styles.series__info}>
                  <p>{el.name}</p>
                  <Link href={`/show/${el.id}`}>
                    <img src={el.image ? el.image : "/img/poster.jpg"} alt="poster"/>
                  </Link>
                  <button
                    className={styles.series__delete__btn}
                    onClick={() => deleteWatched(el.id)}
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))
          : ""}
        {arrLength === 0 || arrLength === undefined ? (
          <h1 className={styles.series__h1}>
            You don't have any series added yet, go to <a href="/">Homepage</a>{" "}
            to add your first series
          </h1>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ReadDataFromCloudFirestore;
