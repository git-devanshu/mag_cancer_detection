// generateHTMLReport.js
// Helper: Calculate age from date of birth
const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const diffMs = Date.now() - birthDate.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };
  
export const generateHTMLReport = async (userData, confidence, prediction, cloudinaryURL) => {
    try {
      // Create an HTML report string
      const htmlReport = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>Medical Report</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        margin: 0;
        padding: 0;
        background: #f4f4f4;
      }
      .container {
        width: 90%;
        max-width: 800px;
        margin: 30px auto;
        background: #fff;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        padding: 20px;
        border-radius: 5px;
      }
      .header {
        text-align: center;
        border-bottom: 2px solid #007BFF;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }
      .header h1 {
        color: #007BFF;
        margin: 0;
      }
      .section {
        margin-bottom: 20px;
      }
      .section-title {
        font-size: 18px;
        color: #333;
        margin-bottom: 10px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 5px;
      }
      .details {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      .detail {
        width: 48%;
        margin-bottom: 10px;
        font-size: 14px;
        color: #555;
      }
      .full-width {
        width: 100%;
      }
      .image-container {
        text-align: center;
        margin-top: 20px;
      }
      .image-container img {
        max-width: 100%;
        height: auto;
        border: 1px solid #ddd;
        padding: 5px;
        background: #fff;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Medical Report</h1>
      </div>
      <div class="section">
        <div class="section-title">Patient Information</div>
        <div class="details">
          <div class="detail"><strong>Name:</strong> ${userData.name}</div>
          <div class="detail"><strong>Username:</strong> ${userData.username}</div>
          <div class="detail"><strong>Age:</strong> ${calculateAge(userData.dateOfBirth)}</div>
          <div class="detail"><strong>Gender:</strong> ${userData.gender}</div>
          <div class="detail full-width"><strong>Email:</strong> ${userData.email}</div>
          <div class="detail full-width"><strong>Test Date:</strong> ${userData.testDate}</div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">Test Results</div>
        <div class="details">
          <div class="detail"><strong>Prediction:</strong> ${prediction}</div>
          <div class="detail"><strong>Confidence:</strong> ${confidence}%</div>
        </div>
      </div>
      <div class="section image-container">
        <img src="${cloudinaryURL}" alt="Medical Image" />
      </div>
    </div>
  </body>
  </html>
`;

  
      // Prepare the payload containing doctorEmail and the HTML report
      const payload = {
        doctorEmail: userData.doctorEmail,
        htmlReport,
      };

      setTimeout(async()=>{
        // Send the HTML report to the backend API endpoint
        const response = await fetch("http://localhost:4000/reports/send-report", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
    
        if (response.ok) {
            console.log("HTML report sent successfully!");
        } else {
            console.error("Failed to send HTML report");
        }
      }, 1500);
    } catch (error) {
      console.error("Error generating HTML report:", error);
    }
  };
  