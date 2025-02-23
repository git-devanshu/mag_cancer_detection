import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import userImg from "../images/profileDhan.png";
import axios from 'axios'
import { getBaseURL } from "../utils/helperFunctions";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SkinCancerMeter from "../components/SkinCancermeter";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [refresh, setRefresh] = useState(false);

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
  }, [refresh]);

  const saveDoctorEmail = () =>{
    const token = sessionStorage.getItem('token')
    axios.put(getBaseURL()+'/users/add-doctor-email', {doctorEmail : userData.doctorEmail}, {headers : {
      'Authorization' : `Bearer ${token}`
    }})
    .then(res =>{
      if(res.status === 200){
        setUserData(res.data);
        toast.success('Doctor email updated');
        refreshData();
      }
    })
    .catch(err =>{
      console.log(err)
      toast.error('Failed to update doctor email');
    })
  }

  const refreshData = () =>{
    setRefresh(!refresh);
  }

  const updateUserData = () =>{
    const token = sessionStorage.getItem('token')
    axios.put(getBaseURL()+'/users/update', {name : userData.name, dateOfBirth : userData.dateOfBirth, gender : userData.gender}, {headers : {
      'Authorization' : `Bearer ${token}`
    }})
    .then(res =>{
      if(res.status === 200){
        toast.success('User data updated successfully');
        closeModal();
        refreshData();
      }
    })
    .catch(err =>{
      console.log(err);
      toast.error('Failed to update user data');
    })
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const navigateToMenu = () =>{
    navigate('/menu');
  }

  const logout = () => {
    sessionStorage.removeItem("token");
    toast.success("User logged out");
    setTimeout(() => {
        navigate("/");
    }, 1000);
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
          <button onClick={navigateToMenu} className="header-btn">Test</button>
          <button onClick={logout} className="header-btn">Logout</button>
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
              style={{ height: "60px", width: "60px" }}
            />
            <div className="user-info">
              <p className="user-field">
                <b>Name:</b> {userData.name}
              </p>
              <p className="user-field">
                <b>Email:</b> {userData.email}
              </p>
              <p className="user-field">
                <b>Username:</b> {userData.username}
              </p>
              <p className="user-field">
                <b>Gender:</b> {userData.gender}
              </p>
              <p className="user-field">
                <b>DOB:</b> {userData.dateOfBirth}
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
                name="doctorEmail"
                placeholder="example@gmail.com"
                className="email-input"
                value = {userData.doctorEmail}
                onChange={handleChange}
              />
              <button onClick={saveDoctorEmail} className="email-save-btn">Save</button>
            </div>
          </div>

          <h2 className="past-records-title">Past Records</h2>
          <div className="cards-container">
            {userData?.pastRecords?.length !== 0 && userData?.pastRecords?.map((record, ind) => {
              return(
                <div className="record-card">
                  <div className="skin-img-div">
                      <img className="skin-img"
                        src={record.imageURL}
                        alt="Record 1"
                      />
                  </div>
                  {/* <p className="card-field-name" style={{margin:'0'}}>
                    <b>Type:</b> <span style={{color: "red", margin:'0'}}>{record.category}</span>
                  </p> */}
                  <p className="card-field" style={{margin:'0'}}>
                    <b>Date:</b> {record.testDate}
                  </p>
                  <SkinCancerMeter category={record.category} confidence={record.confidence} he={15}/>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      {/* Modal Popup for Updating User Data */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 style={{fontWeight: '500'}}>Update User Data</h2>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleChange}
            />

            {/* <label htmlFor="age">Gender:</label>
            <input
              type="text"
              id="gender"
              name="gender"
              value={userData.gender}
              onChange={handleChange}
            /> */}
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              name="gender"
              value={userData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>


            <label htmlFor="dob">DOB:</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={userData.dateOfBirth}
              onChange={handleChange}
            />

            <div className="modal-buttons">
              <button className="save-btn" onClick={updateUserData}>
                Save
              </button>
              <button className="update-btn" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster/>
    </div>
  );
};

export default Dashboard;