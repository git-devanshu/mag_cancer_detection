import React from "react";

const SkinCancerMeter = ({ category, confidence }) => {
  // Compute probabilities
  const benignProbability = category === "benign" ? confidence : 100 - confidence;
  const malignantProbability = 100 - benignProbability;

  // Determine bar colors
  const leftColor = category === "benign" ? "green" : "red";
  const rightColor = category === "benign" ? "red" : "green";

  return (
    <div style={styles.container}>
      {/* Probability Labels */}
      <div style={styles.labels}>
        <span style={{ color: leftColor, fontWeight: "bold" }}>
          {benignProbability.toFixed(1)}% {category === "benign" ? "Benign" : "Malignant"}
        </span>
        <span style={{ color: rightColor, fontWeight: "bold" }}>
          {malignantProbability.toFixed(1)}% {category === "benign" ? "Malignant" : "Benign"}
        </span>
      </div>

      {/* Probability Bar */}
      <div style={styles.bar}>
        <div
          style={{
            ...styles.filled,
            background: "green",
            width: `${benignProbability}%`,
          }}
        />
        <div
          style={{
            ...styles.filled,
            background: "red",
            width: `${malignantProbability}%`,
          }}
        />
      </div>
    </div>
  );
};

// Styling for the component
const styles = {
  container: {
    width: "100%",
    maxWidth: "400px",
    padding: "10px",
  },
  labels: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "5px",
    fontSize: "14px",
  },
  bar: {
    display: "flex",
    width: "100%",
    height: "25px",
    borderRadius: "8px",
    overflow: "hidden",
    border: "2px solid #ddd",
  },
  filled: {
    height: "100%",
    transition: "width 0.5s ease-in-out",
  },
};

export default SkinCancerMeter;
