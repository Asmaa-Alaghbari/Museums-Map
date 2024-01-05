// Select.js is a component that allows users to select their favorite museums.

import "../css/Select.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useAuth } from "../security/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Select() {
  const authContext = useAuth();
  const navigate = useNavigate();
  const [favoritePoint, setFavoritePoint] = useState([]);
  const [notFavoritePoint, setNotFavoritePoint] = useState([]);
  const [pointToRemove, setPointToRemove] = useState([]);
  const [allPoints, setAllPoints] = useState([]);

  
  const fetchMuseumData = async () => {
    try {
      const response_01 = await axios.get(`http://localhost:8080/api/favoritePoint/${authContext.name}`);
      setNotFavoritePoint(response_01.data);

      const response_02 = await axios.get(`http://localhost:8080/api/allPoints`);
      setAllPoints(response_02.data);
    } catch (error) {
      console.error('Error fetching museum data:', error);
    }
  }

  useEffect(() => {
    fetchMuseumData();
  }, [authContext.name]);

  const handleSelect = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    if (isChecked) {
      setFavoritePoint([...favoritePoint, value]); // Add to temporary favorite list
    } else {
      setFavoritePoint(favoritePoint.filter(item => item !== value)); // Remove from temporary favorite list
    }
  };

  const handleRemoveFavorite = (museumName) => {
  setNotFavoritePoint(notFavoritePoint.filter(item => item.name !== museumName));
  setPointToRemove([...pointToRemove, museumName]); // Add museum to the removal list
};

  async function handleUpdate() {
    try {
      // Process adding to favorites
      if (favoritePoint.length > 0) {
        await axios.post(`http://localhost:8080/api/addFavoritePoint/${authContext.name}`, { favorPoints: favoritePoint });
      }

      // Process removal from favorites
      if (pointToRemove.length > 0) {
        await axios.post(`http://localhost:8080/api/removeFavoritePoint/${authContext.name}`, { notFavorPoints: pointToRemove });
      }

      // Refresh data
      await fetchMuseumData();
    } catch (error) {
      console.error(error);
    }
  }

  const handleBack = () => {
      navigate("/museum");
  };

  const renderMuseumList = (museums, isFavorite) => {
    return museums.map((museum, index) => (
      <div className="museum-card" key={index}>
        <label htmlFor={`museum-${museum.id}`} className="museum-card-label">
          <div className="museum-overlay">
            <div className="museum-info">
              <h5>{museum.name}</h5>
              {isFavorite ? (
                <button onClick={() => handleRemoveFavorite(museum.name)} className="remove-favorite-btn">
                  <i className="fas fa-times"></i>
                </button>
              ) : (
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id={`museum-${museum.id}`}
                  value={museum.name}
                  onChange={(e) => handleSelect(e, false)}
                />
              )}
            </div>
          </div>
        </label>
      </div>
    ));
  };

  return (
    <div className="container select-container">
      <div className="museum-section">
        <h6 className="section-title">All Museums</h6>
        <div className="museum-grid">
          {renderMuseumList(allPoints, false)}
        </div>
      </div>
      <div className="museum-section">
        <h6 className="section-title">My Museums</h6>
        <div className="museum-grid">
          {renderMuseumList(notFavoritePoint, true)}
        </div>
      </div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
      <button className="btn update-btn" onClick={handleUpdate}>Update Results</button>
      <button className="btn back-btn" onClick={handleBack}><i className="fas fa-arrow-left"></i></button>
    </div>
  );
}

