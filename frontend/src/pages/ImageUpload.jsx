import { useState } from "react";
import axios from "axios";

export default function ImageUpload() {
  const [image, setImage] = useState(null); // For preview
  const [uploadedImage, setUploadedImage] = useState(null); // For Cloudinary
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState(""); // New state for confidence score
  const [error, setError] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file); // Store file for backend prediction
      setImage(URL.createObjectURL(file)); // Preview image
      uploadToCloudinary(file);

      setImagePreview(null);
      setPrediction("");
      setConfidence(""); // Reset confidence
      setError("");

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImagePreview(reader.result);
      };
    }
  };

  const uploadToCloudinary = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "portfolio_cms");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dxksp15ir/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Cloudinary URL:", data.secure_url);
      setUploading(false);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
    }
  };

  const handlePredict = async () => {
    if (!uploadedImage) {
      alert("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadedImage); // Use actual file

    try {
      const response = await axios.post(
        "http://localhost:5000/predict",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.prediction && response.data.confidence !== undefined) {
        setPrediction(response.data.prediction);
        setConfidence(response.data.confidence); // Set confidence score
        setError("");
      } else {
        setError("Prediction failed");
        setPrediction("");
        setConfidence("");
      }
    } catch (err) {
      setError("Error: " + err.message);
      setPrediction("");
      setConfidence("");
    }
  };

  return (
    <div>
      {/* Upload Section */}
      <div
        style={{
          width: "150px",
          height: "50px",
          border: "2px dashed gray",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          position: "relative",
          borderRadius: "10px",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
          }}
        />

        {image ? (
          <img
            src={image}
            alt="Preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ color: "gray" }}>
            {uploading ? "Uploading..." : "Click to Upload"}
          </span>
        )}
      </div>

      {/* Prediction Section */}
      <button onClick={handlePredict} style={{ marginBottom: "10px" }}>
        Predict
      </button>

      {prediction && (
        <div>
          <h2>Prediction: {prediction}</h2>
          <h3>Confidence: {confidence}%</h3> {/* Show confidence score */}
        </div>
      )}

      {imagePreview && (
        <div>
          <h2>Uploaded Image Preview:</h2>
          <img
            src={imagePreview}
            alt="Uploaded Preview"
            style={{ width: "200px", height: "200px", objectFit: "cover" }}
          />
        </div>
      )}

      {error && (
        <div style={{ color: "red" }}>
          <h3>{error}</h3>
        </div>
      )}
    </div>
  );
}
