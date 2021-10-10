import { useEffect, useState } from "react";
import styles from "../styles/Scroll.module.scss";

const Scroll = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toogleVisibility = () => {
    if (window.pageYOffset > 300) setIsVisible(true);
    else setIsVisible(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toogleVisibility);

    return () => {
      window.removeEventListener("scroll", toogleVisibility);
    };
  }, []);

  return (
    <div className={styles.scroll}>
      <button
        type="button"
        className={
          isVisible ? styles.scroll__visible : styles.scroll__notVisible
        }
        onClick={scrollToTop}
      >
        <span>☝️</span>
      </button>
    </div>
  );
};

export default Scroll;
