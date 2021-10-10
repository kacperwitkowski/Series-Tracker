import Head from "next/dist/next-server/lib/head";
import styles from "../styles/Dashboard.module.scss";
import ReadDataFromCloudFirestore from "../components/cloudFirestore/read";
import { useUser } from "../firebase/useUser";
import ProfilePicChange from "../components/profilePicChange";
import Scroll from "../components/scroll";

export default function Logged() {
  const { user, logout } = useUser();

  if (user) {
    return (
      <>
        <Head>
          <title>Series Tracker | Dashboard</title>
          <meta name="keywords" content="series tracker dashboard" />
        </Head>
        <div className={styles.dashboard}>
          <div className={styles.dashboard__info}>
            <div className={styles.dashboard__details}>
              <ProfilePicChange />
              <div className={styles.dashboard__name__info}>
                <p className={styles.dashboard__name}>
                  <span>{user.name}</span>
                </p>
                <p>{user.email}</p>
              </div>
              <button
                className={styles.dashboard__logout__button}
                onClick={() => logout()}
                title="Logout"
              >
                👋
              </button>
            </div>
          </div>
          <div className={styles.dashboard__series}>
            <ReadDataFromCloudFirestore />
          </div>
          <Scroll />
        </div>
      </>
    );
  } else {
    return (
      <div className={styles.auth}>
        <Head>
          <title>Series Tracker | Login</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <h1>Hope to see you soon!👋</h1>
      </div>
    );
  }
}
