import type React from "react";
import styles from "./button.module.css"; // ✅ Import dengan variable styles

interface LitButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export default function LitButton({ children, onClick }: LitButtonProps) {
  return (
    <button onClick={onClick} className={styles.litButton}>
      {children}
    </button>
  );
}
