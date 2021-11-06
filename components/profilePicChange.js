import { useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.scss";
import firebase from "firebase";
import { useUser } from "../firebase/useUser";

const ProfilePicChange = () => {
  const [picture, setPicture] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user } = useUser();

  useEffect(() => {
  if (user) {
    firebase
      .firestore()
      .collection("Avatars")
      .doc(user.id)
      .get()
      .then((snapshot) => {
        let data = snapshot.data();
        if (data === undefined) {
          return;
        } else {
          localStorage.setItem("avatar", data.data);
          setPicture(data.data);
        }
      });
  }
  },[[]])

  const avatars = [
    "Lucifer.jpg",
    "Sponge.png",
    "Walter.png",
    "Daenerys.jpg",
    "Luther.jpg",
    "Scott.jpg",
    "Rick.png",
    "Annalise.jpg",
    "Professor.jpg",
    "Eleven.jpg",
    "Beth.jpg",
    "Elliot.jpg",
    "Sherlock.jpg",
    "BoJack.jpg",
    "Tommy.jpg",
    "Dexter.jpg",
    "Rachel.jpg",
    "Reddington.jpg",
    "Queen.png",
    "Scofield.jpg",
  ];

  const avatarChange = (e, img) => {
    Array.from(e.target.closest("div").childNodes).forEach(
      (el) => (el.style.border = "none")
    );

    localStorage.setItem("avatar", img);
    e.target.style.border = "2px solid green";
  };

  const showModal = () => {
    setIsModalVisible(true);
    document.body.style.overflowY = "hidden";
  };

  const handleOk = () => {
    setIsModalVisible(false);
    sendData();
    document.body.style.overflowY = "scroll";
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    document.body.style.overflowY = "scroll";
  };

  const sendData = () => {
    let data = localStorage.getItem("avatar") || "";
    try {
      firebase.firestore().collection("Avatars").doc(user.id).set({
        data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const imageMap = avatars.map((img, i) => {
    return (
      <img
        key={i}
        className={styles.modal__img}
        src={`/img/${img}`}
        onClick={(e) => avatarChange(e, img)}
      />
    );
  });

  return (
    <>
      <div className={styles.dashboard__image__container}>
        <img src={picture ? `/img/${picture}` : "/img/av3.png"} />
        <button
          type="primary"
          onClick={showModal}
          className={styles.dashboard__change__button}
        >
          Change 👤
        </button>
      </div>
      {isModalVisible ? (
        <div className={styles.modal__overlay}>
          <div className={styles.modal}>
            <div className={styles.modal__img__container}>{imageMap}</div>
            <div className={styles.modal__buttons}>
              <button
                onClick={handleCancel}
                className={`${styles.modal__cancelBtn} ${styles.modal__btn}`}
              >
                Cancel
              </button>
              <button onClick={handleOk} className={`${styles.modal__btn}`}>
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default ProfilePicChange;
