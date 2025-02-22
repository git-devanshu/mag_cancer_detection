import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import SkinCancerMeter from "../components/SkinCancermeter";
import {getBaseURL, getCurrentDate} from '../utils/helperFunctions';

export default function Menu() {
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState(null); // Image preview for UI
    const [imageFile, setImageFile] = useState(null); // Actual file for backend
    const [cloudinaryUrl, setCloudinaryUrl] = useState(""); // Cloudinary URL storage
    const [uploading, setUploading] = useState(false);
    const [prediction, setPrediction] = useState("");
    const [confidence, setConfidence] = useState("");
    const [severity, setSeverity] = useState(""); // New state for severity
    const [error, setError] = useState("");

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

    const addResultToRecords = () =>{
        const token = sessionStorage.getItem('token');
        axios.post(getBaseURL()+'/users/add-records', {imageURL : cloudinaryUrl, testDate : getCurrentDate(2), category : prediction, confidence}, {headers : {
            'Authorization': `Bearer ${token}`
        }})
        .then(res=>{
            if(res.status === 200){
                toast.success(res.data.message);
            }
        })
        .catch(err =>{
            console.log(err);
            toast.error('Failed to add test records');
        });
    }

    const handlePredict = async () => {
        if (!imageFile) {
            alert("Please upload an image.");
            return;
        }

        const formData = new FormData();
        formData.append("file", imageFile); // Send actual file

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
                setSeverity(response.data.severity); // Capture severity from backend
                setError("");
            } else {
                setError("Prediction failed");
                setPrediction("");
                setConfidence(""); // Reset confidence if prediction fails
                setSeverity("");
            }
        } catch (err) {
            setError("Error: " + err.message);
            setPrediction("");
            setConfidence(""); // Reset confidence on error
            setSeverity("");
        }
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif", padding: "15px", backgroundColor: "#F8F8F8", height: "100vh" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#009879", padding: "10px 20px", borderRadius: "5px" }}>
                <h2 style={{ color: "white" }}>Team4Real</h2>
                <button onClick={logout} style={{ backgroundColor: "#FF8C42", border: "none", padding: "8px 15px", borderRadius: "5px", color: "white", cursor: "pointer" }}>Logout</button>
            </div>

            {/* Main Container */}
            <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
                {/* Upload Section */}
                <div style={{ flex: 1, backgroundColor: "#E8F6F6", padding: "20px", borderRadius: "10px" }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Check your skin</h3>
                    {imagePreview && <img src={imagePreview} alt="Uploaded" style={{ height: '200px', width: 'auto', display: "block" }} />}
                    <div style={{ marginTop: "10px", display: 'flex', gap: '10px' }}>
                        <button onClick={handlePredict} style={{ backgroundColor: "#009879", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}>Check</button>
                        <button onClick={() => { setImagePreview(null); setImageFile(null); setPrediction(""); setConfidence(""); setSeverity(""); }} style={{ backgroundColor: "#FF8C42", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}>Clear</button>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginTop: "10px" }} />
                </div>

                {/* Report Section */}
                <div style={{ flex: 1.5, backgroundColor: "#E8F6F6", padding: "20px", borderRadius: "10px" }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Image Reports</h3>
                    <p>Prediction: {prediction}</p>
                    <p>Confidence Level: {confidence}</p>
                    <p>Severity: {severity}</p> {/* Display the severity here */}
                    <div style={{ width: "70%", height: "10px", backgroundColor: "#D3D3D3", borderRadius: "5px" }}></div>
                    <button style={{ backgroundColor: "#009879", border: "none", padding: "8px 15px", borderRadius: "5px", color: "white", cursor: "pointer", marginTop: "10px" }}>View Report</button>
                    <button onClick={addResultToRecords} style={{ backgroundColor: "#009879", border: "none", padding: "8px 15px", borderRadius: "5px", color: "white", cursor: "pointer", marginTop: "10px" }}>Save Records</button>
                    <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Follow-up Recommendations</h3>
                    <div style={{ width: "100%", height: "50px", backgroundColor: "#D3D3D3", borderRadius: "10px", marginTop: "10px" }}></div>
                    <SkinCancerMeter category={'benign'} confidence={10}/>
                </div>
            </div>
            <Toaster />
        </div>
    );
}