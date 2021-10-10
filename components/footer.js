import styles from "../styles/Footer.module.scss";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <p className={styles.footer__p}>
        &#64;All Rights Reserved by
        <a href="https://github.com/kacperwitkowski" target="_blank">
          {" "}
          Kacper Witkowski
        </a>
      </p>
    </div>
  );
};

export default Footer;
