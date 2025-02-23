import React from "react";

const RecommendationList = ({ recommendations }) => {
  if (!recommendations) return <p>No recommendations available.</p>;

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <pre>{recommendations}</pre>
    </div>
  );
};

export default RecommendationList;
