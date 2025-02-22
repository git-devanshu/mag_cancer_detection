import React, { useState } from "react";
import "../styles/Dashboard.css";
import userImg from "../images/profileDhan.png";

const Dashboard = () => {
  // State for controlling the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [userData, setUserData] = useState({
    name: "Ramesh Surve",
    email: "ramesh@example.com",
    age: 34,
    dob: "2004-11-10",
    gender: "Male",
  });

  // Separate state for the form inside the modal
  const [formData, setFormData] = useState(userData);

  // Open the modal and preload the form with existing user data
  const openModal = () => {
    setFormData(userData);
    setIsModalOpen(true);
  };

  // Close the modal without saving
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Update form state when an input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save the changes and close the modal
  const handleSave = () => {
    setUserData(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="logo">Team4Real</h1>
        </div>
        {/* Ask and Logout buttons */}
        <div className="header-right">
          <button className="header-btn">Ask</button>
          <button className="header-btn">Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Left Side: User Data */}
        <section className="user-section">
          <div className="user-profile">
            <img
              src={userImg}
              alt="User Profile"
              style={{ height: "50px", width: "50px" }}
            />
            <div className="user-info">
              <p className="user-field">
                <b>Name:</b> {userData.name}
              </p>
              <p className="user-field">
                <b>Email:</b> {userData.email}
              </p>
              <p className="user-field">
                <b>Age:</b> {userData.age}
              </p>
              <p className="user-field">
                <b>Gender:</b> {userData.gender}
              </p>
              <p className="user-field">
                <b>DOB:</b> {userData.dob}
              </p>
            </div>
          </div>
          <div className="user-actions">
            <button className="update-btn" onClick={openModal}>
              Update
            </button>
          </div>
        </section>

        {/* Right Side: Doctor's Email & Past Records */}
        <section className="records-section">
          <div className="doctor-email">
            <label htmlFor="doctorEmail" className="email-label">
              Your Doctor's email
            </label>
            <div className="email-input-group">
              <input
                id="doctorEmail"
                type="email"
                placeholder="example@gmail.com"
                className="email-input"
              />
              <button className="email-save-btn">Save</button>
            </div>
          </div>

          <h2 className="past-records-title">Past Records</h2>
          <div className="cards-container">
            {/* Record Card 1 */}
            <div className="record-card">
              <div className="skin-img-div">
                  <img className="skin-img"
                    src="https://www.cancer.org/content/dam/cancer-org/images/galleries/skin-cancer-images/cancer-squamous-cell-carcinoma-02-restricted.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg"
                    alt="Record 1"
                  />
              </div>
              <p className="card-field-name">
                <b>Type:</b> <span style={{color: "red"}}>Benign</span>
              </p>
              <p className="card-field">
                <b>Date:</b> 12 feb 25
              </p>
              <p className="card-field">
                <b>Severity:</b> Modrate
              </p>
            </div>
            {/* Record Card 2 */}
            <div className="record-card">
              <img src="https://via.placeholder.com/150" alt="Record 2" />
              <p className="card-field">
                <b>Date:</b> 14 feb 25
              </p>
              <p className="card-field">
                <b>Level:</b> High
              </p>
            </div>
            {/* Record Card 3 */}
            <div className="record-card">
              <img src="https://via.placeholder.com/150" alt="Record 3" />
              <p className="card-field">
                <b>Date:</b> 22 feb 25
              </p>
              <p className="card-field">
                <b>Level:</b> Modrate
              </p>
            </div>
            <div className="record-card">
              <img src="https://via.placeholder.com/150" alt="Record 4" />
              <p className="card-field">
                <b>Date:</b> 22 feb 25
              </p>
              <p className="card-field">
                <b>Level:</b> Modrate
              </p>
            </div>
            <div className="record-card">
              <img src="https://via.placeholder.com/150" alt="Record 5" />
              <p className="card-field">
                <b>Date:</b> 22 feb 25
              </p>
              <p className="card-field">
                <b>Level:</b> Modrate
              </p>
            </div>
            <div className="record-card">
              <img src="https://via.placeholder.com/150" alt="Record 6" />
              <p className="card-field">
                <b>Date:</b> 22 feb 25
              </p>
              <p className="card-field">
                <b>Level:</b> Modrate
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Modal Popup for Updating User Data */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Update User Data</h2>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />

            <label htmlFor="dob">DOB:</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
              <button className="update-btn" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;