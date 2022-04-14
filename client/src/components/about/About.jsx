import './about.css';
import React from 'react'

function About({user}) {
  return (
    <>
    <h4 className="profile-info-title">User Information</h4>
    <div className="about-wrap">
      <div className="about-info-item">
        <span className="about-info-key">Username:</span>
        <span className="about-info-value">{user.username}</span>
      </div>
      <div className="about-info-item">
        <span className="about-info-key">First Name:</span>
        <span className="about-info-value">{user.firstName}</span>
      </div>
      <div className="about-info-item">
        <span className="about-info-key">Last Name:</span>
        <span className="about-info-value">{user.lastName}</span>
      </div>
      <div className="about-info-item">
        <span className="about-info-key">Email:</span>
        <span className="about-info-value">{user.email}</span>
      </div>
      <div className="about-info-item">
        <span className="about-info-key">Relationship:</span>
        <span className="about-info-value">{user.relationship === 1 ? "Single" : user.relationship === 2 ? "Married" : "--"}</span>
      </div>
    </div>
  </>
  )
}

export default About