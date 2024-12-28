// src/components/WeatherCard.js
import React from 'react';
import { Card } from 'react-bootstrap';

const WeatherCard = ({ city, temperature, condition, icon, humidity, windSpeed }) => {
  return (
    <Card className="weather-card">
      <Card.Body>
        <Card.Title>{city}</Card.Title>
        <img
          src={`https://openweathermap.org/img/wn/${icon}.png`}
          alt={condition}
        />
        <h3>{temperature}°</h3>
        <p>{condition}</p>
        <p>Humidity: {humidity}%</p>
        <p>Wind Speed: {windSpeed} m/s</p>
      </Card.Body>
    </Card>
  );
};

export default WeatherCard;
