import { useState } from "react";

export default function ImageUpload({ onUpload }) {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            uploadToCloudinary(file);
        }
    };

    const uploadToCloudinary = async (file) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "portfolio_cms"); // Set in Cloudinary settings
        formData.append("cloud_name", "dxksp15ir");

        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dxksp15ir/image/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            onUpload(data.secure_url); // Return image URL
            setUploading(false);
        } catch (error) {
            console.error("Upload failed:", error);
            setUploading(false);
        }
    };

    return (
        <div style={{
            width: "120px",
            height: "40px",
            border: "2px dashed gray",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            position: "relative",
            borderRadius: "10px",
            overflow: "hidden"
        }}>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ position: "absolute", width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
            />
            <span style={{ color: "gray" }}>{uploading ? "Uploading..." : "Click to Upload"}</span>
        </div>
    );
}