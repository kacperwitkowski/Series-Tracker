import firebase from "firebase/app";
import "firebase/firestore";
import { useState, useEffect } from "react";
import { useUser } from "../../firebase/useUser";
import Link from "next/dist/client/link";
import styles from "../../styles/SeriesDash.module.scss";

const ReadDataFromCloudFirestore = () => {
  const { user } = useUser();
  const [database, setDatabase] = useState("");
  const [arrLength, setArrLength] = useState("");

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
            let data = snapshot.data();
            setDatabase(data);
            let dataLength = JSON.parse(localStorage.getItem("series"));
            setArrLength(dataLength.length);
            if (data === undefined) {
              localStorage.setItem("series", "[]");
            } else {
              localStorage.setItem("series", JSON.stringify(data.data2));
            }
          });
      }
    }

    return () => {
      isCancelled = true;
    };
  }, [[]]);

  const deleteWatched = (ID) => {
    let toDelete = JSON.parse(localStorage.getItem("series"));
    const filtered = toDelete.filter((item) => item.id !== ID);
    localStorage.setItem("series", JSON.stringify(filtered));

    firebase
      .firestore()
      .collection("Users")
      .doc(user.id)
      .set({ data2: filtered });
  };

  let time = database
    ? database.data2
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
          ? database.data2.map((el) => (
              <div className={styles.series__content} key={el.id}>
                <div className={styles.series__info}>
                  <p>{el.name}</p>
                  <Link href={`/show/${el.id}`}>
                    <img src={el.image ? el.image : "/img/poster.jpg"} />
                  </Link>
                  <span
                    className={styles.series__delete__btn}
                    onClick={() => deleteWatched(el.id)}
                  >
                    &times;
                  </span>
                </div>
              </div>
            ))
          : ""}
        {arrLength === 0 ? (
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
