import Head from "next/head";
import styles from "../styles/About.module.scss"
import Scroll from "../components/scroll";

const About = () => {
  return (
    <>
      <Head>
        <title>Series Tracker | About</title>
        <meta name="keywords" content="series tracker about" />
      </Head>

      <div className={styles.about}>
        <div className={styles.about__content}>
          <div className={styles.about__content__nav}>
            <h2>
              About <span>us</span> Me
            </h2>
          </div>
          <div className={styles.about__content__wrapper}>
            <div className={styles.about__content__info}>
              <img src="/gif/patrick.gif" alt="funny gif"/>
              <h2>General</h2>
              <p>
                Series Tracker allows users to browse theirs favourite TV shows
                and series. On this site you can freely (of course, if you are
                logged in) find every important detail about the show you are
                interested in, leave your rating and add any series to your
                watched list. As your watchlist grows, so does watch time. Find
                out if you are a real series geek! Series Tracker is a site
                fully made by{" "}
                <a href="https://github.com/kacperwitkowski" target="_blank">
                  Kacper Witkowski
                </a>
              </p>
            </div>
            <div className={styles.about__content__contact}>
              <img src="/gif/money.gif" alt="funny gif"/>
              <h2>Contact</h2>
              <p>
                If you have any questions or you are interested in working
                together you can find me here:
              </p>
              <div className={styles.about__links}>
                <a target="_blank" href="https://github.com/kacperwitkowski">
                  <img src="/svg/github.svg" alt="github logo"/>
                </a>
                <a target="_blank" href="mailto:witkowskik46@gmail.com">
                  <img src="/svg/gmail.svg" alt="gmail logo"/>
                </a>
                <a target="_blank" href="https://www.instagram.com/">
                  <img src="/svg/instagram.svg" alt="instagram logo"/>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Scroll />
    </>
  );
};

export default About;
