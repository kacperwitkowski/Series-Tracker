import Link from "next/link";
import styles from "../styles/Navbar.module.scss";
import { useUser } from "../firebase/useUser";

const Navbar = () => {
  const { user } = useUser();

  return (
    <div className={styles.navbar}>
      <div className={styles.container}>
        <nav className={styles.navbar__nav}>
          <div className={styles.navbar__brand}>
            <Link href="/">
              <a>
                <img className={styles.navbar__logo} src="/img/logo.png" alt="logo"/>
                <span>Series Tracker</span>
              </a>
            </Link>
          </div>
          <div className={styles.navbar__linksContainer}>
            <Link href="/about">
              <a>About</a>
            </Link>
            <Link href="/rankings">
              <a>Rankings</a>
            </Link>
            <Link href="/game">
              <a>Game</a>
            </Link>
            <Link href={user ? "/dashboard" : "/auth"}>
              <a>{user ? "Dashboard" : "Login"}</a>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
