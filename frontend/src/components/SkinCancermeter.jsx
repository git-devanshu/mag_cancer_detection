import React from "react";

const SkinCancerMeter = ({ category, confidence, he }) => {
  // Calculate benign probability: if category is benign, then confidence is for benign,
  // otherwise, it's 100 - confidence.
  const benignProbability = category === "benign" ? confidence : 100 - confidence;
  const malignantProbability = 100 - benignProbability;

  // Fixed colors for the labels and bars
  const leftColor = "green"; // Benign
  const rightColor = "red";  // Malignant

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
      height: `${he}px`,
      borderRadius: "8px",
      overflow: "hidden",
      border: "2px solid #ddd",
    },
    filled: {
      height: "100%",
      transition: "width 0.5s ease-in-out",
    },
  };

  return (
    <div style={styles.container}>
      {/* Probability Labels */}
      <div style={styles.labels}>
        <span style={{ color: leftColor, fontWeight: "bold" }}>
          {benignProbability.toFixed(1)}% Benign
        </span>
        <span style={{ color: rightColor, fontWeight: "bold" }}>
          {malignantProbability.toFixed(1)}% Malignant
        </span>
      </div>

      {/* Probability Bar */}
      <div style={styles.bar}>
        <div
          style={{
            ...styles.filled,
            background: leftColor,
            width: `${benignProbability}%`,
          }}
        />
        <div
          style={{
            ...styles.filled,
            background: rightColor,
            width: `${malignantProbability}%`,
          }}
        />
      </div>
    </div>
  );
};

export default SkinCancerMeter;
