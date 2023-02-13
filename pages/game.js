import Head from "next/dist/next-server/lib/head";
import styles from "../styles/Game.module.scss";
import { useState, useEffect } from "react";
import SingleCard from "../components/singleCard";
import Scroll from "../components/scroll";

const Game = () => {
  const [series, setSeries] = useState("");
  const [avatar, setAvatar] = useState("");
  const [pickedOnes, setPickedOnes] = useState("");
  const [gameIsON, setGameIsON] = useState(false);
  const [nm1, setNm1] = useState(null);
  const [nm2, setNm2] = useState(null);
  const [disable, setDisable] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    let seriesFromLC = JSON.parse(localStorage.getItem("series") || "[]");
    setSeries(seriesFromLC);
    let avatar = localStorage.getItem("avatar");
    setAvatar(avatar);
  }, []);

  const chooseSeries = (e, el) => {
    let closestEl = e.target.closest("div");

    let duplicate = pickedOnes
      ? pickedOnes.find((element) => element.src === el.image)
      : "";
    if (duplicate) {
      closestEl.className = `${styles.game__unselectColor}`;
      let filtered = pickedOnes.filter((item) => item.src !== el.image);
      setPickedOnes(filtered);
    } else {
      closestEl.className = `${styles.game__selectColor}`;
      setPickedOnes([...pickedOnes, { src: el.image, matched: false }]);
    }
  };

  const startGame = () => {
    gameFunctionality();
    setGameIsON(true);
  };

  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);

  const gameFunctionality = () => {
    const shuffleImages = [...pickedOnes, ...pickedOnes]
      .sort(() => Math.random() - 0.5)
      .map((img) => ({ ...img, id: Math.random() }));

    setNm1(null);
    setNm2(null);
    setCards(shuffleImages);
    setTurns(0);
  };

  const handleClick = (card) => {
    nm1 ? setNm2(card) : setNm1(card);
  };

  useEffect(() => {
    if (nm1 && nm2) {
      setDisable(true);
      if (nm1.src === nm2.src) {
        setCards((prev) => {
          return prev.map((card) => {
            if (card.src === nm1.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        reset();
      } else {
        setTimeout(() => reset(), 1000);
      }
    }
  }, [nm1, nm2]);

  const reset = () => {
    setNm1(null);
    setNm2(null);
    setTurns((prev) => prev + 1);
    setDisable(false);
  };

  return (
    <>
      <Head>
        <title>Series Tracker | Game</title>
        <meta name="keywords" content="series tracker game" />
      </Head>
      <div
        className={styles.game}
        style={
          darkTheme
            ? { backgroundColor: "#171717", margin: "0px auto", color: "#999" }
            : null
        }
      >
        <div
          className={styles.game__rules}
          style={gameIsON ? { display: "none" } : { display: "flex" }}
        >
          <h2>
            Are you bored {avatar ? `"${avatar.slice(0, -4)}"` : "friend"}? I
            know what can wake you up!
          </h2>
          <p>
            I'm sure you heard of a "memory game". It's simple game where the
            players try to remember the flipped cards and then find a pair for
            them. You win when all cards are matched! Now on Series Tracker you
            might test your memory by facing my version of this game! To start
            you have to choose cards from your watched list which will be down
            there if you previously added any. You can play on 3 different
            difficulty levels. Easy- 8 cards, Medium - 12 cards and analogously
            16 cards for level Hard. Good Luck!
          </p>
          <p>PS. Of course you have to be also logged in order to start!</p>
          {pickedOnes.length === 8 ||
          pickedOnes.length === 12 ||
          pickedOnes.length === 16 ? (
            <button
              disabled={false}
              style={gameIsON ? { display: "none" } : { display: "flex" }}
              onClick={startGame}
              className={styles.game__button}
            >
              Start the game
            </button>
          ) : (
            <button
              disabled={true}
              style={gameIsON ? { display: "none" } : { display: "flex" }}
              className={styles.game__button}
            >
              Start the game
            </button>
          )}
        </div>

        <div
          className={styles.game__content}
          style={gameIsON ? { display: "none" } : { display: "flex" }}
        >
          {series
            ? series.map((el) => (
                <div key={el.id} onClick={(e) => chooseSeries(e, el)}>
                  <div className={styles.game__images}>
                    <img alt="poster" src={el.image ? el.image : "/img/poster.jpg"} />
                  </div>
                </div>
              ))
            : ""}
        </div>
        <div
          className={styles.game__start}
          style={gameIsON ? { display: "flex" } : { display: "none" }}
        >
          <a href="/game">&#11013; Select other cards</a>
          <div className={styles.game__start__info}>
            <button
              className={`${styles.game__button} ${styles.game__restart}`}
              style={darkTheme ? { color: "#999" } : { color: "black" }}
              onClick={gameFunctionality}
            >
              Restart the Game
            </button>
            <p>Turns: {turns}</p>
          </div>
          <div className={styles.game__themeSwitcher}>
            <span className={!darkTheme ? styles.game__sun : ""}>
              &#127773;
            </span>
            <div className={styles.game__switchCheckbox}>
              <label className={styles.game__switchCheckbox__label}>
                <input
                  type="checkbox"
                  onChange={() => setDarkTheme(!darkTheme)}
                />
                <span
                  className={`${styles.game__slider} ${styles.game__round}`}
                ></span>
              </label>
            </div>
            <span className={darkTheme ? styles.game__moon : ""}>
              &#127770;
            </span>
          </div>
        </div>
        <div
          className={styles.game__cards}
          style={gameIsON ? { display: "flex" } : { display: "none" }}
        >
          {cards.map((card) => (
            <SingleCard
              key={card.id}
              card={card}
              handleChoice={handleClick}
              flip={card === nm1 || card === nm2 || card.matched}
              disable={disable}
            />
          ))}
        </div>
        <Scroll />
      </div>
    </>
  );
};

export default Game;
