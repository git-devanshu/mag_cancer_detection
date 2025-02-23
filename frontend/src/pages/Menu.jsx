import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import SkinCancerMeter from "../components/SkinCancermeter";
import { getBaseURL, getCurrentDate } from "../utils/helperFunctions";
import cloudimage from "../images/cloud.png";
import { Spacer } from "@chakra-ui/react";
import RecommendationList from "../components/RecommendationList";
import {generateHTMLReport} from '../utils/generatePDF';

export default function Menu() {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("No file chosen, yet!");
  const [imagePreview, setImagePreview] = useState(null); // Image preview for UI
  const [imageFile, setImageFile] = useState(null); // Actual file for backend
  const [cloudinaryUrl, setCloudinaryUrl] = useState(""); // Cloudinary URL storage
  const [uploading, setUploading] = useState(false);
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState("");
  const [severity, setSeverity] = useState(""); // New state for severity
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState(``);
  const [userData, setUserData] = useState({});

  useEffect(()=>{
    const token = sessionStorage.getItem('token')
    axios.get(getBaseURL()+'/users/user-data', {headers : {
      'Authorization' : `Bearer ${token}`
    }})
    .then(res =>{
      if(res.status === 200){
        setUserData(res.data);
      }
    })
    .catch(err =>{
      console.log(err)
      toast.error('Failed to fetch user data')
    })
  }, []);

  const logout = () => {
    sessionStorage.removeItem("token");
    toast.success("User logged out");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name); // Set the file name
      setImageFile(file); // Store file for backend prediction
      setImagePreview(URL.createObjectURL(file)); // Show preview
      uploadToCloudinary(file); // Upload to Cloudinary
      setPrediction("");
      setError("");
      setConfidence("");
      setSeverity("");
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
      setCloudinaryUrl(data.secure_url); // Store Cloudinary URL
      console.log(data.secure_url);
      setUploading(false);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
    }
  };

  const addResultToRecords = () => {
    const token = sessionStorage.getItem("token");
    axios
      .post(
        getBaseURL() + "/users/add-records",
        {
          imageURL: cloudinaryUrl,
          testDate: getCurrentDate(1),
          category: prediction,
          confidence,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to add test records");
      });
  };

  const handlePredict = async () => {
    if (!imageFile) {
      alert("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/predict",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.prediction) {
        setPrediction(response.data.prediction);
        setConfidence(response.data.confidence);
        setSeverity(response.data.severity);
        setError("");
      } else {
        setError("Prediction failed");
        setPrediction("");
        setConfidence("");
        setSeverity("");
      }
    } catch (err) {
      setError("Error: " + err.message);
      setPrediction("");
      setConfidence("");
      setSeverity("");
    }
  };

  const fetchRecommendations = () =>{
    axios.get(getBaseURL()+'/users/recommendations', {headers : {
        'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
    }})
    .then(res =>{
        if(res.status === 200){
            setRecommendations(res.data);
            console.log(res.data);
        }
    })
    .catch(err =>{
        console.log(err);
        toast.error('Error fetching recommendations');
    })
  }

  const navigateToProfile = () =>{
    navigate('/profile');
  }

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#F8F8F8",
        minHeight: "100vh",
        height: 'auto'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#009879",
          padding: "15px 25px",
        }}
      >
        <h2 style={{ color: "white", fontSize: "1.4em" }}>Team4Real</h2>
        <Spacer/>
        <button
          onClick={navigateToProfile}
          style={{
            backgroundColor: "#FFffff",
            border: "none",
            padding: "10px 17px",
            borderRadius: "5px",
            color: "#12ac8e",
            cursor: "pointer",
            marginRight: '10px',
            fontWeight: "bold"
          }}
        >
          Profile
        </button>
        <button
          onClick={logout}
          style={{
            backgroundColor: "#FF8C42",
            border: "none",
            padding: "10px 17px",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Container */}
      <div
        style={{
          display: "flex",
          height: "100vh",
        }}
      >
        {/* Upload Section */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#E8F6F6",
            padding: "20px",
            textAlign: "center",
            height: "100%",
            paddingTop: "10px",
          }}
        >
          <h3 style={{ fontSize: "20px", fontWeight: "700" }}>
            Check your skin
          </h3>

          <div style={styles.uploadContainer}>
            {!imagePreview && (
              <img style={styles.uploadIcon} src={cloudimage} alt="" />
            )}

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={styles.imagePreview}
              />
            )}
            <p style={styles.uploadText}>{fileName}</p>
            <label style={styles.uploadButton} htmlFor="file-upload">
              CHOOSE A FILE
            </label>
            <input
              type="file"
              id="file-upload"
              style={{ display: "none" }}
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              onClick={handlePredict}
              style={{
                backgroundColor: "#009879",
                color: "white",
                border: "none",
                padding: "12px 25px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                width: "170px",
                height: "53px",
              }}
            >
              Check
            </button>
            <button
              onClick={() => {
                setImagePreview(null);
                setImageFile(null);
                setPrediction("");
                setConfidence("");
                setSeverity("");
                setFileName("No file chosen, yet!");
              }}
              style={{
                backgroundColor: "#FF8C42",
                color: "white",
                border: "none",
                padding: "12px 25px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                width: "170px",
                height: "53px",
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Report Section */}
        <div
          style={{
            flex: 1.5,
            backgroundColor: "#E8F6F6",
            padding: "25px",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              fontSize: "22px",
              fontWeight: "700",
              marginBottom: "15px",
            }}
          >
            Image Reports
          </h3>

          <div
            style={{
              width: "50%",
              backgroundColor: "white",
              padding: "15px",
              borderRadius: "10px",
              textAlign: "center",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <p style={{ fontSize: "18px", fontWeight: "600", color: "#333" }}>
              Prediction:{" "}
              <span style={{ fontWeight: "bold", color: "#009879" }}>
                {prediction || "N/A"}
              </span>
            </p>
            <p style={{ fontSize: "16px", fontWeight: "500", color: "#555" }}>
              Confidence Level:{" "}
              <span style={{ fontWeight: "bold" }}>{confidence || "N/A"}</span>
            </p>
            <p style={{ fontSize: "16px", fontWeight: "500", color: "#555" }}>
              Severity:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: severity === "High" ? "#FF4C4C" : "#009879",
                }}
              >
                {severity || "N/A"}
              </span>
            </p>

            {/* SkinCancerMeter replacing the progress bar */}
            <div style={{ marginTop: "15px" }}>
              <SkinCancerMeter category={prediction} confidence={parseFloat(confidence)} />
            </div>
          </div>

          {/* Buttons */}
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              gap: "15px",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => generateHTMLReport(userData, confidence, prediction, cloudinaryUrl)}
              style={{
                backgroundColor: "#009879",
                border: "none",
                padding: "12px 20px",
                borderRadius: "8px",
                color: "white",
                cursor: "pointer",
                fontSize: "16px",
                width: "150px",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
              }}
            >
              Send Report
            </button>
            <button
              onClick={addResultToRecords}
              style={{
                backgroundColor: "#FF8C42",
                border: "none",
                padding: "12px 20px",
                borderRadius: "8px",
                color: "white",
                cursor: "pointer",
                fontSize: "16px",
                width: "150px",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
              }}
            >
              Save Records
            </button>
            <button
              onClick={fetchRecommendations}
              style={{
                backgroundColor: "#FF8C42",
                border: "none",
                padding: "12px 20px",
                borderRadius: "8px",
                color: "white",
                cursor: "pointer",
                fontSize: "16px",
                width: "150px",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
              }}
            >
              Follow up
            </button>
          </div>

          {/* Follow-up Recommendations */}
          <h3
            style={{ fontSize: "20px", fontWeight: "700", marginTop: "20px" }}
          >
            Follow-up Recommendations
          </h3>
          <div
            style={{
              width: "100%",
              height: "50px",
              borderRadius: "10px",
              marginTop: "10px",
            }}
          >
          {recommendations?.length !== 0 && <RecommendationList recommendations={recommendations}/>}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

const styles = {
  uploadContainer: {
    textAlign: "center",
    padding: "5px",
    border: "2px dashed #ccc",
    borderRadius: "10px",
    background: "white",
    width: "450px",
    minWidth: "400px",
    height: "290px",
    margin: "auto",
    marginTop: "5px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
  },

  uploadIcon: {
    width: "200px",
    height: "auto",
    color: "#7b57ff",
    marginTop: "-5px",
  },
  uploadText: {
    color: "#555",
    fontSize: "14px",
  },
  uploadButton: {
    display: "inline-block",
    padding: "8px 16px",
    fontSize: "14px",
    color: "white",
    background: "linear-gradient(45deg, #7b57ff, #4f8bff)",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "0.3s",
    marginBottom: "7px",
  },
  imagePreview: {
    width: "95%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "5px",
  },
};
