import styles from "../styles/ShowDetails.module.scss";

const Spinner = () => {
  return (
    <div className={styles.spinner}>
      <img src="/gif/spinner.gif" alt="spinner" />
    </div>
  );
};

export default Spinner;
