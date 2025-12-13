import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

const HOME_IMAGES = [
  "/img/gameofthrones_home.png",
  "/img/avatar_home.png",
  "/img/bigbangtheory_home.png",
  "/img/casadepapel_home.png",
] as const;

export default function Home() {
  const navigate = useNavigate();
  const [heroImg, setHeroImg] = useState<string>("");

  const randomImg = useMemo(() => {
    const idx = Math.floor(Math.random() * HOME_IMAGES.length);
    return HOME_IMAGES[idx];
  }, []);

  useEffect(() => {
    setHeroImg(randomImg);
  }, [randomImg]);

  const handleGetStarted = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className={styles.page}>
      <div className={styles.right} aria-hidden="true">
        {heroImg && <img src={heroImg} alt="" />}
      </div>

      <div className={styles.main}>
        <img src="/img/logo.png" alt="Nite" />
        <h1>A better way to keep track of your favorite tv shows.</h1>
        <button type="button" onClick={handleGetStarted}>
          Get started
        </button>
      </div>
    </div>
  );
}
