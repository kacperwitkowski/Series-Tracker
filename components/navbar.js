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
                <img className={styles.navbar__logo} src="/img/logo.png" alt="logo"/>
                <span>Series Tracker</span>
            </Link>
          </div>
          <div className={styles.navbar__linksContainer}>
            <Link href="/about">
            About
            </Link>
            <Link href="/rankings">
              Rankings
            </Link>
            <Link href="/game">
              Game
            </Link>
            <Link href={user ? "/dashboard" : "/auth"}>
              {user ? "Dashboard" : "Login"}
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
