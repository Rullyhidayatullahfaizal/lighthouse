import type React from "react"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import styles from "./sheet.module.css"

interface SheetProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  title?: string
}

export default function Sheet({ children, isOpen, onClose, title }: SheetProps) {
  const [isMounted, setIsMounted] = useState(false)

  // Handle mounting animation
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Handle unmounting animation
  const handleTransitionEnd = () => {
    if (!isOpen) {
      setIsMounted(false)
    }
  }

  if (!isMounted && !isOpen) return null

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.backdrop} ${isOpen ? styles.backdropVisible : ""}`} onClick={onClose} />
      <div className={`${styles.sheet} ${isOpen ? styles.sheetVisible : ""}`} onTransitionEnd={handleTransitionEnd}>
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          <button onClick={onClose} className={styles.closeButton}>
            <X size={18} />
            <span className={styles.srOnly}>Close</span>
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}