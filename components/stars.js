import styles from "../styles/ShowDetails.module.scss";

const Stars = ({ onMouseEnter, onMouseLeave, onClick, color }) => {

  return (
    <div
      className={styles.star}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <svg
        height="35px"
        width="33px"
        viewBox="0 0 25 23"
        data-rating="1"
        style={{ fill: color }}
      >
        <polygon
          strokeWidth="0"
          points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78"
        />
      </svg>
    </div>
  );
};

export default Stars;
