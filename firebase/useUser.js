import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import "firebase/auth";
import initFirebase from "../firebase/initFirebase";
import {
  removeUserCookie,
  setUserCookie,
  getUserFromCookie,
} from "./userCookies";
import { mapUserData } from "./mapUserData";

initFirebase();

const useUser = () => {
  const [user, setUser] = useState();
  const router = useRouter();

  const logout = async () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        router.push("/");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    const cancelAuthListener = firebase.auth().onIdTokenChanged((user) => {
      if (user) {
        const userData = mapUserData(user);
        setUserCookie(userData);
        setUser(userData);
      } else {
        removeUserCookie();
        setUser();
        localStorage.setItem("series", "[]");
        localStorage.setItem("avatar", "");
        localStorage.setItem("stars", "[]");
      }
    });

    const userFromCookie = getUserFromCookie();
    if (!userFromCookie) {
      router.push("/");
      return;
    }
    setUser(userFromCookie);

    return () => {
      cancelAuthListener();
    };
  }, []);

  return { user, logout };
};

export { useUser };
