import Link from "next/link";
import styles from "../styles/ListShowsView.module.scss";

const ListShowsView = ({ image, name, rating, id }) => {
  return (
    <div>
      <Link href={`/show/${id}`}>
        <div className={styles.card}>
          <div className={styles.card__list}>
            <div>
              <img
                className={`${styles.card__img_1} ${styles.card__img}`}
                src="/img/lc1.png"
                alt="tape"
              />
              <img
                className={`${styles.card__img_2} ${styles.card__img}`}
                src="/img/lc2.png"
                alt="tape"
              />
              <img
                className={`${styles.card__img_3} ${styles.card__img}`}
                src="/img/lc1.png"
                alt="tape"
              />
              <div className={styles.card__imageContainer}>
                <img src={image} alt={name} />
              </div>
              <div className={styles.card__details}>
                <h4>{name}</h4>
                <h4>{rating}</h4>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListShowsView;
