import React from "react";
import "./BottomNavbar.css";
import ARModeButtonImage from './images/ARModeButton.png';

export const ARModeButton = () => {
  return (
    <div className="ar-mode-container">
      <img alt="ar-mode" src={ARModeButtonImage} className="ar-mode-button" onClick={ async () => {
        window.location = "https://console.echoar.xyz/geoarjs?key=noisy-recipe-0500&entry=25f1c4d7-91c5-4a65-b527-19dddc189972";
      }}/>
    </div>
  )
};
