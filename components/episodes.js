import styles from "../styles/Episodes.module.scss";
import { useEffect, useState } from "react";

const Episodes = ({ id }) => {
  const [episodeData, setEpisodeData] = useState([]);
  const [seasonNumber, setSeasonNumber] = useState([]);
  const [selected, setSelected] = useState(null);
  const [summary, setSummary] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetch(`https://api.tvmaze.com/shows/${id}/seasons`)
      .then((response) => response.json())
      .then((data) => {
        setSeasonNumber(data);
      });

    fetch(`https://api.tvmaze.com/shows/${id}/episodes`)
      .then((response) => response.json())
      .then((data) => {
        setEpisodeData(data);
      });
  }, []);

  const toggle = (i) => {
    if (selected === i) {
      return setSelected(null);
    }
    setSelected(i);
  };

  const summaryRoll = (ep) => {
    setSummary(ep.id);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setSummary(0);
  };

  return (
    <div className={styles.episodes}>
      <div className={styles.episodes__seasons__container}>
        {seasonNumber.map((el, i) => (
          <div data-set={[i + 1]} key={[i + 1]}>
            <div className={styles.singleSeason} onClick={() => toggle(i)}>
              Season {el.number}
              <button>{selected === i ? "-" : "+"}</button>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.episodes__container}>
        {episodeData.map((ep, i) =>
          selected === ep.season - 1 ? (
            <div className={styles.episodes__singleEpisode} key={ep.id}>
              <div className={styles.episodes__singleEpisode__title}>
                {summary !== ep.id ? <h2>{i + 1}</h2> : ""}
                <h3 id={ep.id}>{ep.name}</h3>
                {ep.summary && summary !== ep.id ? (
                  <button onClick={() => summaryRoll(ep)}>
                    *Check the summary*
                  </button>
                ) : (
                  ""
                )}
                {summary === ep.id && isModalVisible ? (
                  <>
                    <button onClick={handleCancel}>Back</button>
                    <p>{ep.summary.replace(/(<([^>]+)>)/gi, "")}</p>
                  </>
                ) : (
                  ""
                )}
              </div>
              <div className={styles.episodes__summary__container}>
                {summary !== ep.id ? (
                  <img src={ep.image ? ep.image.medium : "/img/poster.jpg"} />
                ) : (
                  ""
                )}
                <p>Airdate: {ep.airdate ? ep.airdate : "No data"}</p>
              </div>
            </div>
          ) : (
            ""
          )
        )}
      </div>
    </div>
  );
};

export default Episodes;
