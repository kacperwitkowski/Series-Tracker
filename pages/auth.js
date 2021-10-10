import Head from "next/dist/next-server/lib/head";
import FirebaseAuth from "../components/auth/FirebaseAuth";
import styles from "../styles/Dashboard.module.scss";

const Auth = () => {
  return (
    <>
      <Head>
        <title>Series Tracker | Login</title>
        <meta name="keywords" content="series tracker auth login" />
      </Head>
      <div className={styles.auth}>
        <div>
          <FirebaseAuth />
        </div>
      </div>
    </>
  );
};

export default Auth;
