import React, { useState } from "react";
import ImageUpload from "../components/ImageUpload";
import { useNavigate } from "react-router-dom";
import {Toaster, toast} from 'react-hot-toast';
import axios from 'axios';

const Menu = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [prediction, setPrediction] = useState("");
    const [confidence, setConfidence] = useState("");
    const [error, setError] = useState("");

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    const handlePredict = async () => {
        if (!image) {
          alert("Please upload an image.");
          return;
        }
    
        const formData = new FormData();
        formData.append("file", image); // Use actual file
    
        try {
            const response = await axios.post(
                "http://localhost:5000/predict",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
        
            if (response.data.prediction && response.data.confidence) {
                setPrediction(response.data.prediction);
                setConfidence(response.data.confidence);
            } else {
                setError("Prediction failed");
                setPrediction("");
            }
        } 
        catch (err) {
            setError("Error: " + err.message);
            setPrediction("");
        }
    };

    const logout = () =>{
        sessionStorage.removeItem('token');
        toast.success('User logged out');
        setTimeout(()=>{
            navigate('/');
        }, 1000);
    }

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
                    <h3 style={{fontSize: '20px', fontWeight: '700'}}>Check your skin</h3>
                    <img src={image ? image : ""} style={{height: '200px', width: 'auto'}}/>
                    <div style={{ marginTop: "10px", display: 'flex', gap: '10px' }}>
                        <ImageUpload onUpload={handleImageUpload}/>
                        <button onClick={handlePredict} style={{ backgroundColor: "#009879", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}>Check</button>
                        <button onClick={()=>{setImage(null)}} style={{ backgroundColor: "#FF8C42", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}>Clear</button>
                    </div>
                </div>

                {/* Report Section */}
                <div style={{ flex: 1.5, backgroundColor: "#E8F6F6", padding: "20px", borderRadius: "10px" }}>
                    <h3 style={{fontSize: '20px', fontWeight: '700'}}>Image Reports</h3>
                    <p>Prediction : {prediction}</p>
                    <p>Confidence level : {confidence}</p>
                    <p>Risk level</p>
                    <div style={{ width: "70%", height: "10px", backgroundColor: "#D3D3D3", borderRadius: "5px" }}></div>
                    <button style={{ backgroundColor: "#009879", border: "none", padding: "8px 15px", borderRadius: "5px", color: "white", cursor: "pointer", marginTop: "10px" }}>View Report</button>
                    <h3 style={{fontSize: '20px', fontWeight: '700'}}>Follow-up Recommendations</h3>
                    <div style={{ width: "100%", height: "50px", backgroundColor: "#D3D3D3", borderRadius: "10px", marginTop: "10px" }}></div>
                </div>
            </div>
            <Toaster/>
        </div>
    );
};

export default Menu;