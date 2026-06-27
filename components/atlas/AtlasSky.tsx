import styles from "./atlas.module.css";

const stars = [
  [8, 12, "sm"], [14, 42, "xs"], [18, 72, "md"], [23, 22, "xs"], [31, 35, "sm"],
  [37, 84, "xs"], [44, 18, "md"], [48, 68, "xs"], [56, 28, "sm"], [59, 66, "xs"],
  [64, 9, "sm"], [70, 52, "xs"], [72, 28, "md"], [78, 76, "xs"], [83, 58, "sm"],
  [88, 14, "xs"], [94, 82, "sm"], [11, 88, "xs"], [28, 58, "sm"], [52, 43, "xs"],
  [68, 18, "xs"], [91, 47, "xs"]
] as const;

const constellationPoints = [
  [64, 26], [70, 34], [78, 30], [82, 42], [74, 50]
] as const;

export default function AtlasSky() {
  return (
    <div className={styles.sky} aria-hidden="true">
      <div className={styles.nebulaOne} />
      <div className={styles.nebulaTwo} />
      <div className={styles.starfield}>
        {stars.map(([x, y, size], index) => (
          <span
            className={`${styles.star} ${styles[size]}`}
            style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${(index % 7) * 0.4}s` }}
            key={`${x}-${y}-${index}`}
          />
        ))}
      </div>
      <svg className={styles.constellation} viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline points={constellationPoints.map(([x, y]) => `${x},${y}`).join(" ")} />
        {constellationPoints.map(([x, y]) => <circle cx={x} cy={y} r="0.45" key={`${x}-${y}`} />)}
      </svg>
    </div>
  );
}
