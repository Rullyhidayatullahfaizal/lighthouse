import React from "react";
import styles from "./modal.module.css"; 


interface LitModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function LitModal({ children, onClose }: LitModalProps) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        {children}
    <button onClick={onClose} className={styles.modalCloseBtn}>Close</button>
      </div>
    </div>
  );
}
