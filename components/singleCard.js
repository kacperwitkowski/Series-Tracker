import styles from "../styles/Game.module.scss";

const SingleCard = ({ card, handleChoice, flip, disable }) => {
  const handleClick = () => {
    if (!disable) {
      handleChoice(card);
    }
  };

  return (
    <div className={styles.game__card}>
      <div className={flip ? `${styles.game__flipped}` : `${styles.game__notFlipped}`}>
        <img src={card.src} className={styles.game__card__front} alt="card front" />
        <img
          src="/img/logo.png"
          className={styles.game__card__back}
          alt="card back"
          onClick={handleClick}
          style={{ backgroundColor: "firebrick" }}
        />
      </div>
    </div>
  );
};

export default SingleCard;
