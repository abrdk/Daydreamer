import styles from "@/styles/menu.module.scss";

export default function PlusIcon() {
  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 25 25"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.plusSvg}
      style={{
        pointerEvents: "none",
      }}
    >
      <rect
        x="0.5"
        y="0.5"
        width="24"
        height="24"
        rx="12"
        fill="white"
        stroke="#258EFA"
        style={{
          pointerEvents: "none",
        }}
      />
      <path
        d="M12.563 7.62646V17.5008"
        stroke="#258EFA"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          pointerEvents: "none",
        }}
      />
      <path
        d="M17.5001 12.564L7.62575 12.564"
        stroke="#258EFA"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          pointerEvents: "none",
        }}
      />
    </svg>
  );
}
