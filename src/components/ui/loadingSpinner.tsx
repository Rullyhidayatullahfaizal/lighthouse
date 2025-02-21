import type React from "react"

interface LoadingSpinnerProps {
  size?: number
  color?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 40, color = "#ae83e5" }) => {
  const spinnerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    border: `4px solid ${color}`,
    borderTop: "4px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  }

  return (
    <div style={{ display: "inline-block" }}>
      <div style={spinnerStyle} />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}

export default LoadingSpinner

