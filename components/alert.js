import styles from "../styles/Home.module.scss";
const Alert = ({msg,type }) => {
  return (
    <div className={styles.container}> 
      <div className={styles.alert}>
        {msg}
      </div>
    </div>
  );
};

export default Alert;
